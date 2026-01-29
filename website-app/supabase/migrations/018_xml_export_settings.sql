-- Migration 018: XML-Export Settings fuer DTVZ-Integration
-- Fuegt Felder fuer die DTVZ-XML-Generierung zu user_settings und invoices hinzu

-- =====================================================
-- 1. user_settings: XML-Export Konfiguration
-- =====================================================

-- IK-Nummer (Institutionskennzeichen) - 9-stellig
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS
  ik_nummer VARCHAR(9) NULL;

-- Herstellungsort (kann abweichen von Laboradresse, z.B. bei Aussenstellen)
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS
  herstellungsort_strasse VARCHAR(200) NULL;

ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS
  herstellungsort_plz VARCHAR(10) NULL;

ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS
  herstellungsort_ort VARCHAR(100) NULL;

ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS
  herstellungsort_land VARCHAR(50) DEFAULT 'Deutschland';

-- Default-Einstellung: XML automatisch generieren?
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS
  xml_export_default BOOLEAN DEFAULT false;

-- =====================================================
-- 2. invoices: XML-Tracking Felder
-- =====================================================

-- Flag: Wurde XML-Generierung fuer diese Rechnung angefordert?
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS
  generate_xml BOOLEAN DEFAULT false;

-- URL zur generierten XML-Datei in Supabase Storage
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS
  xml_url TEXT NULL;

-- Zeitstempel der XML-Generierung
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS
  xml_generated_at TIMESTAMPTZ NULL;

-- =====================================================
-- 3. shared_links: Link-Typ fuer PDF vs XML
-- =====================================================

-- Unterscheidung ob Link zu PDF oder XML fuehrt
ALTER TABLE shared_links ADD COLUMN IF NOT EXISTS
  link_type VARCHAR(10) DEFAULT 'pdf';

-- Constraint fuer erlaubte Werte (nur wenn Spalte noch keinen Constraint hat)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'shared_links_link_type_check'
  ) THEN
    ALTER TABLE shared_links
    ADD CONSTRAINT shared_links_link_type_check
    CHECK (link_type IN ('pdf', 'xml'));
  END IF;
END $$;

-- =====================================================
-- 4. Kommentare fuer Dokumentation
-- =====================================================

COMMENT ON COLUMN user_settings.ik_nummer IS 'Institutionskennzeichen (IK) des Labors, 9-stellig numerisch';
COMMENT ON COLUMN user_settings.herstellungsort_strasse IS 'Herstellungsort Strasse (falls abweichend von Laboradresse)';
COMMENT ON COLUMN user_settings.herstellungsort_plz IS 'Herstellungsort PLZ (falls abweichend)';
COMMENT ON COLUMN user_settings.herstellungsort_ort IS 'Herstellungsort Stadt (falls abweichend)';
COMMENT ON COLUMN user_settings.herstellungsort_land IS 'Herstellungsort Land (Default: Deutschland)';
COMMENT ON COLUMN user_settings.xml_export_default IS 'Standardmaessig DTVZ-XML bei Rechnungen generieren';

COMMENT ON COLUMN invoices.generate_xml IS 'Wurde DTVZ-XML fuer diese Rechnung angefordert?';
COMMENT ON COLUMN invoices.xml_url IS 'Supabase Storage URL der generierten XML-Datei';
COMMENT ON COLUMN invoices.xml_generated_at IS 'Zeitstempel wann XML generiert wurde';

COMMENT ON COLUMN shared_links.link_type IS 'Typ des Links: pdf oder xml';
