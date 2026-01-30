-- Migration 023: Fix beta_feedback_with_lab view for Edge Functions
-- Problem: View ohne SECURITY INVOKER = FALSE kann RLS-Probleme verursachen

-- 1) View neu erstellen mit expliziter Security-Einstellung
DROP VIEW IF EXISTS beta_feedback_with_lab;

CREATE VIEW beta_feedback_with_lab
WITH (security_invoker = false)
AS
SELECT
  bf.id,
  bf.user_id,
  bf.email,
  bf.rating,
  bf.feedback_type,
  bf.message,
  bf.answers,
  bf.context,
  bf.source,
  bf.page_url,
  bf.status,
  bf.tags,
  bf.created_at,
  bf.updated_at,
  bf.telegram_notified_at,
  us.lab_name,
  us.contact_name
FROM beta_feedback bf
LEFT JOIN user_settings us ON bf.user_id = us.user_id;

-- 2) Index für häufige Abfragen (optional, aber empfohlen)
CREATE INDEX IF NOT EXISTS idx_beta_feedback_telegram_notified
  ON beta_feedback(telegram_notified_at)
  WHERE telegram_notified_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_beta_feedback_type
  ON beta_feedback(feedback_type);
