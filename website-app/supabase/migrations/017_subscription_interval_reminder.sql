-- Migration 017: Subscription interval and renewal reminder tracking

ALTER TABLE user_settings
  ADD COLUMN IF NOT EXISTS subscription_interval TEXT;

ALTER TABLE user_settings
  ADD COLUMN IF NOT EXISTS subscription_renewal_reminded_for TIMESTAMPTZ;
