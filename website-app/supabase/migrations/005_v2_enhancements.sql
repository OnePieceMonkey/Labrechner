-- ################################################
-- Migration 005: V2 Enhancements
-- Neue Features: AVV-Tracking, AI-Disclaimer, Organizations, BEL-Rules
-- ################################################

-- ================================================
-- TEIL A: Funktioniert JETZT (keine Abhängigkeiten)
-- ================================================

-- 1. AVV & AI Disclaimer Tracking für user_settings
ALTER TABLE user_settings
  ADD COLUMN IF NOT EXISTS has_accepted_avv BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS avv_accepted_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS ai_disclaimer_accepted_at TIMESTAMP WITH TIME ZONE;

-- 2. Organizations (Multi-User Vorbereitung)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_settings JSONB DEFAULT '{"prefix": "RE-", "suffix": "", "current_number": 1000}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- org_id zu user_settings hinzufügen
ALTER TABLE user_settings
  ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);

-- 3. BEL-Rules für KI-Plausibilitäts-Check
CREATE TABLE IF NOT EXISTS bel_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_positions TEXT[] NOT NULL,
  suggested_positions TEXT[] NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Beispiel-Regeln einfügen
INSERT INTO bel_rules (trigger_positions, suggested_positions, description) VALUES
  (ARRAY['1022'], ARRAY['0010', '0020'], 'Bei Vollkrone oft Modell und Bissnahme benötigt'),
  (ARRAY['2010'], ARRAY['0010', '0030'], 'Bei Brückenglied oft Modell und Artikulator benötigt'),
  (ARRAY['3010'], ARRAY['0010', '0051'], 'Bei Prothese oft Modell und Abformung benötigt')
ON CONFLICT DO NOTHING;

-- ################################################
-- RLS für neue Tabellen
-- ################################################

-- Organizations
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own organization" ON organizations
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can create organizations" ON organizations
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own organization" ON organizations
  FOR UPDATE USING (owner_id = auth.uid());

-- BEL Rules (lesbar für alle authentifizierten User)
ALTER TABLE bel_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read bel_rules" ON bel_rules
  FOR SELECT TO authenticated USING (true);

-- ################################################
-- Indexes für Performance
-- ################################################

CREATE INDEX IF NOT EXISTS idx_organizations_owner_id ON organizations(owner_id);
CREATE INDEX IF NOT EXISTS idx_bel_rules_trigger ON bel_rules USING GIN(trigger_positions);

-- ################################################
-- Trigger für updated_at
-- ################################################

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- TEIL B: SPÄTER - Wenn invoices/custom_positions existieren
-- ================================================

-- TODO: Migration 006 erstellen wenn Tabellen angelegt sind:
--
-- -- MwSt-Rate für Custom Positions
-- ALTER TABLE custom_positions
--   ADD COLUMN IF NOT EXISTS vat_rate NUMERIC(5,2) DEFAULT 19.00,
--   ADD COLUMN IF NOT EXISTS is_material BOOLEAN DEFAULT FALSE;
--
-- -- Invoice-Erweiterungen für MwSt-Trennung
-- ALTER TABLE invoices
--   ADD COLUMN IF NOT EXISTS total_net_7 NUMERIC(10,2) DEFAULT 0,
--   ADD COLUMN IF NOT EXISTS total_vat_7 NUMERIC(10,2) DEFAULT 0,
--   ADD COLUMN IF NOT EXISTS total_net_19 NUMERIC(10,2) DEFAULT 0,
--   ADD COLUMN IF NOT EXISTS total_vat_19 NUMERIC(10,2) DEFAULT 0;
--
-- -- Shared Links für Magic-Link Sharing
-- CREATE TABLE IF NOT EXISTS shared_links (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
--   token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
--   expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
--   access_count INT DEFAULT 0,
--   max_access_count INT DEFAULT 10,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );
--
-- ALTER TABLE shared_links ENABLE ROW LEVEL SECURITY;
--
-- CREATE POLICY "Users can manage their shared links" ON shared_links
--   FOR ALL USING (
--     invoice_id IN (
--       SELECT id FROM invoices WHERE user_id = auth.uid()
--     )
--   );
--
-- CREATE POLICY "Public access via valid token" ON shared_links
--   FOR SELECT USING (
--     expires_at > NOW()
--     AND access_count < max_access_count
--   );
--
-- CREATE INDEX IF NOT EXISTS idx_shared_links_token ON shared_links(token);
-- CREATE INDEX IF NOT EXISTS idx_shared_links_invoice_id ON shared_links(invoice_id);
