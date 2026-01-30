-- Migration 024: Brand Color for Premium Users
-- Allows users to customize their invoice/PDF accent color

ALTER TABLE user_settings
  ADD COLUMN IF NOT EXISTS brand_color TEXT DEFAULT NULL;

COMMENT ON COLUMN user_settings.brand_color IS 'Custom HEX color for PDF accents (e.g. #8B5CF6). Expert feature.';
