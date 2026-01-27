-- ################################################
-- Migration 014: Add contact name and lab email
-- ################################################

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_settings' AND column_name = 'contact_name'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN contact_name TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_settings' AND column_name = 'lab_email'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN lab_email TEXT;
  END IF;
END $$;
