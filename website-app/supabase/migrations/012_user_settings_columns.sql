-- ################################################
-- Migration 012: User settings columns for profile data
-- ################################################

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'lab_name') THEN
    ALTER TABLE user_settings ADD COLUMN lab_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'lab_street') THEN
    ALTER TABLE user_settings ADD COLUMN lab_street TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'lab_postal_code') THEN
    ALTER TABLE user_settings ADD COLUMN lab_postal_code TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'lab_city') THEN
    ALTER TABLE user_settings ADD COLUMN lab_city TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'tax_id') THEN
    ALTER TABLE user_settings ADD COLUMN tax_id TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'jurisdiction') THEN
    ALTER TABLE user_settings ADD COLUMN jurisdiction TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'bank_name') THEN
    ALTER TABLE user_settings ADD COLUMN bank_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'iban') THEN
    ALTER TABLE user_settings ADD COLUMN iban TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'bic') THEN
    ALTER TABLE user_settings ADD COLUMN bic TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'logo_url') THEN
    ALTER TABLE user_settings ADD COLUMN logo_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'next_invoice_number') THEN
    ALTER TABLE user_settings ADD COLUMN next_invoice_number INTEGER;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'global_factor') THEN
    ALTER TABLE user_settings ADD COLUMN global_factor NUMERIC(5,2);
  END IF;
END $$;
