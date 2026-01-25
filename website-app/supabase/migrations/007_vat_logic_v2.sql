-- ################################################
-- Migration 007: Erweiterte MwSt-Logik (Split 7%/19%)
-- ################################################

-- 1. Vat-Rate zu Rechnungspositionen hinzufügen (als Snapshot)
ALTER TABLE invoice_items ADD COLUMN IF NOT EXISTS vat_rate NUMERIC(5,2) DEFAULT 7.00;

-- 2. Hilfsfunktion: Korrekte MwSt für eine Position ermitteln
CREATE OR REPLACE FUNCTION get_vat_rate_for_item(
  p_position_id INTEGER,
  p_custom_position_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
  v_rate NUMERIC;
BEGIN
  -- 1. BEL-Positionen (7%)
  IF p_position_id IS NOT NULL THEN
    RETURN 7.00;
  END IF;

  -- 2. Custom-Positionen (aus Tabelle lesen)
  IF p_custom_position_id IS NOT NULL THEN
    SELECT vat_rate INTO v_rate FROM custom_positions WHERE id = p_custom_position_id;
    RETURN COALESCE(v_rate, 19.00);
  END IF;

  -- 3. Fallback (19%)
  RETURN 19.00;
END;
$$ LANGUAGE plpgsql;

-- 3. Trigger-Funktion: MwSt-Satz beim Einfügen/Update setzen
CREATE OR REPLACE FUNCTION trigger_set_invoice_item_vat()
RETURNS TRIGGER AS $$
BEGIN
  NEW.vat_rate := get_vat_rate_for_item(NEW.position_id, NEW.custom_position_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger anlegen
DROP TRIGGER IF EXISTS invoice_items_set_vat_trigger ON invoice_items;
CREATE TRIGGER invoice_items_set_vat_trigger
  BEFORE INSERT OR UPDATE ON invoice_items
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_invoice_item_vat();

-- 4. Funktion: Rechnungssummen neu berechnen (Split-MwSt Version)
CREATE OR REPLACE FUNCTION recalculate_invoice_totals(p_invoice_id UUID)
RETURNS VOID AS $$
DECLARE
  v_net_7 NUMERIC(10, 2) := 0;
  v_vat_7 NUMERIC(10, 2) := 0;
  v_net_19 NUMERIC(10, 2) := 0;
  v_vat_19 NUMERIC(10, 2) := 0;
  v_subtotal NUMERIC(10, 2) := 0;
  v_total_vat NUMERIC(10, 2) := 0;
  v_total NUMERIC(10, 2) := 0;
BEGIN
  -- Summe für 7%
  SELECT COALESCE(SUM(line_total), 0) INTO v_net_7
  FROM invoice_items
  WHERE invoice_id = p_invoice_id AND vat_rate = 7.00;

  -- Summe für 19%
  SELECT COALESCE(SUM(line_total), 0) INTO v_net_19
  FROM invoice_items
  WHERE invoice_id = p_invoice_id AND vat_rate = 19.00;

  -- Berechnung der Steuerbeträge
  v_vat_7 := ROUND(v_net_7 * 0.07, 2);
  v_vat_19 := ROUND(v_net_19 * 0.19, 2);
  
  v_subtotal := v_net_7 + v_net_19;
  v_total_vat := v_vat_7 + v_vat_19;
  v_total := v_subtotal + v_total_vat;

  -- Update Invoice
  UPDATE invoices
  SET 
    subtotal = v_subtotal,
    tax_amount = v_total_vat,
    total = v_total,
    total_net_7 = v_net_7,
    total_vat_7 = v_vat_7,
    total_net_19 = v_net_19,
    total_vat_19 = v_vat_19,
    updated_at = NOW()
  WHERE id = p_invoice_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Bestehende Daten aktualisieren (falls vorhanden)
UPDATE invoice_items SET vat_rate = get_vat_rate_for_item(position_id, custom_position_id);

-- 6. Alle Rechnungen einmal neu berechnen
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT id FROM invoices LOOP
    PERFORM recalculate_invoice_totals(r.id);
  END LOOP;
END $$;
