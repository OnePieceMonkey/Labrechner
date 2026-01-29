-- Migration 020: HKP-Nummer (Planidentifikation) fuer Rechnungen
-- Speichert die Heil- und Kostenplan-Nummer des Zahnarztes

-- =====================================================
-- 1. invoices: HKP-Nummer-Feld
-- =====================================================

-- HKP-Nummer aus dem Heil- und Kostenplan des Zahnarztes
-- Wird im DTVZ-XML als <Planidentifikation> ausgegeben
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS
  hkp_nummer VARCHAR(50) NULL;

-- =====================================================
-- 2. Kommentar fuer Dokumentation
-- =====================================================

COMMENT ON COLUMN invoices.hkp_nummer IS 'Heil- und Kostenplan-Nummer des Zahnarztes (Planidentifikation fuer DTVZ-XML)';
