-- Migration 019: Chargennummern fuer Positionen
-- Fuegt Chargennummer-Felder zu template_items und invoice_items hinzu

-- =====================================================
-- 1. template_items: Chargennummer-Feld
-- =====================================================

-- Chargennummer kann bei Vorlagen-Erstellung erfasst werden
-- und wird bei Rechnungserstellung in invoice_items uebernommen
ALTER TABLE template_items ADD COLUMN IF NOT EXISTS
  charge_number VARCHAR(50) NULL;

-- =====================================================
-- 2. invoice_items: Chargennummer-Feld (Snapshot)
-- =====================================================

-- Snapshot der Chargennummer zum Rechnungszeitpunkt
-- Wichtig fuer Medizinprodukte-Dokumentation (MPG)
ALTER TABLE invoice_items ADD COLUMN IF NOT EXISTS
  charge_number VARCHAR(50) NULL;

-- =====================================================
-- 3. Kommentare fuer Dokumentation
-- =====================================================

COMMENT ON COLUMN template_items.charge_number IS 'Chargennummer/Lot-Nummer des Materials (optional, fuer Medizinprodukte-Dokumentation)';
COMMENT ON COLUMN invoice_items.charge_number IS 'Snapshot der Chargennummer zum Rechnungszeitpunkt';

-- =====================================================
-- 4. Index fuer Chargennummer-Suche (optional, fuer spaetere Auswertungen)
-- =====================================================

-- Index auf invoice_items.charge_number fuer Rueckverfolgbarkeit
CREATE INDEX IF NOT EXISTS idx_invoice_items_charge_number
  ON invoice_items (charge_number)
  WHERE charge_number IS NOT NULL;
