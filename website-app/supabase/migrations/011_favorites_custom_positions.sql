-- ################################################
-- Migration 011: Favorites support for custom positions
-- ################################################

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'favorites' AND column_name = 'custom_position_id'
  ) THEN
    ALTER TABLE favorites
      ADD COLUMN custom_position_id UUID REFERENCES custom_positions(id) ON DELETE CASCADE;
  END IF;
END $$;

ALTER TABLE favorites
  ALTER COLUMN position_id DROP NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'favorites_position_check'
  ) THEN
    ALTER TABLE favorites
      ADD CONSTRAINT favorites_position_check
      CHECK (
        (position_id IS NOT NULL AND custom_position_id IS NULL)
        OR (position_id IS NULL AND custom_position_id IS NOT NULL)
      );
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS favorites_user_custom_idx
  ON favorites(user_id, custom_position_id)
  WHERE custom_position_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS favorites_custom_idx
  ON favorites(custom_position_id);
