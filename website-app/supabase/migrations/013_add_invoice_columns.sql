-- ################################################
-- Migration 013: Add missing invoice columns
-- ################################################

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'patient_name'
  ) THEN
    ALTER TABLE invoices ADD COLUMN patient_name TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoice_items' AND column_name = 'vat_rate'
  ) THEN
    ALTER TABLE invoice_items ADD COLUMN vat_rate NUMERIC(5,2) DEFAULT 19.00;
  END IF;
END $$;
