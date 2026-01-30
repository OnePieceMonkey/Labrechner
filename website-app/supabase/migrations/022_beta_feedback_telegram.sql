-- Migration 022: Beta feedback Telegram plumbing

-- 1) Mark feedback rows that have been sent to Telegram
ALTER TABLE beta_feedback
  ADD COLUMN IF NOT EXISTS telegram_notified_at TIMESTAMPTZ;

-- 2) Track weekly summary runs so the cron job knows its last window
CREATE TABLE IF NOT EXISTS beta_feedback_summary_runs (
  id SERIAL PRIMARY KEY,
  covered_from TIMESTAMPTZ NOT NULL,
  covered_to TIMESTAMPTZ NOT NULL,
  feedback_count INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3) Convenience view to enrich feedback with lab/contact info
CREATE OR REPLACE VIEW beta_feedback_with_lab AS
SELECT
  bf.*,
  us.lab_name,
  us.contact_name
FROM beta_feedback bf
LEFT JOIN user_settings us ON bf.user_id = us.user_id;
