ALTER TABLE public.user_settings
ADD COLUMN IF NOT EXISTS theme_preference text NOT NULL DEFAULT 'light';

DO $$ BEGIN
  ALTER TABLE public.user_settings
  ADD CONSTRAINT user_settings_theme_preference_check
  CHECK (theme_preference IN ('light', 'dark'));
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
