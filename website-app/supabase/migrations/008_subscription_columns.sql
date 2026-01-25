-- ################################################
-- Migration 008: Subscription-Spalten für user_settings
-- ################################################

DO $$
BEGIN
  -- Stripe Customer ID
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'stripe_customer_id') THEN
    ALTER TABLE user_settings ADD COLUMN stripe_customer_id TEXT;
  END IF;

  -- Stripe Subscription ID
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'stripe_subscription_id') THEN
    ALTER TABLE user_settings ADD COLUMN stripe_subscription_id TEXT;
  END IF;

  -- Subscription Status
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'subscription_status') THEN
    ALTER TABLE user_settings ADD COLUMN subscription_status TEXT;
  END IF;

  -- Subscription Plan (Default: free)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'subscription_plan') THEN
    ALTER TABLE user_settings ADD COLUMN subscription_plan TEXT DEFAULT 'free';
  END IF;

  -- Subscription Period End
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_settings' AND column_name = 'subscription_period_end') THEN
    ALTER TABLE user_settings ADD COLUMN subscription_period_end TIMESTAMP WITH TIME ZONE;
  END IF;

END $$;
