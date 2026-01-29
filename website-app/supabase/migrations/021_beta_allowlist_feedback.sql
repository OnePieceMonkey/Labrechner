-- Migration 021: Beta Allowlist + Feedback

-- =====================================================
-- 1) Beta-Allowlist
-- =====================================================

CREATE TABLE IF NOT EXISTS beta_allowlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'invited' CHECK (status IN ('invited', 'active', 'revoked')),
  role TEXT DEFAULT 'beta_tester' CHECK (role IN ('beta_tester', 'admin')),
  invited_by UUID REFERENCES auth.users(id),
  note TEXT,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_beta_allowlist_email ON beta_allowlist(email);

ALTER TABLE beta_allowlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage beta_allowlist" ON beta_allowlist
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_settings
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_settings
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- 2) Beta-Feedback
-- =====================================================

CREATE TABLE IF NOT EXISTS beta_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT,
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  feedback_type TEXT DEFAULT 'general' CHECK (feedback_type IN ('general', 'bug', 'feature', 'question', 'praise', 'other')),
  message TEXT NOT NULL,
  answers JSONB,
  context JSONB,
  source TEXT DEFAULT 'app',
  page_url TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'triaged', 'resolved', 'wontfix')),
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_beta_feedback_user_id ON beta_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_beta_feedback_created_at ON beta_feedback(created_at DESC);

ALTER TABLE beta_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users insert own beta_feedback" ON beta_feedback
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users view own beta_feedback" ON beta_feedback
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM user_settings
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins update beta_feedback" ON beta_feedback
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_settings
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_settings
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins delete beta_feedback" ON beta_feedback
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_settings
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- 3) updated_at triggers
-- =====================================================

CREATE TRIGGER update_beta_allowlist_updated_at
  BEFORE UPDATE ON beta_allowlist
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_beta_feedback_updated_at
  BEFORE UPDATE ON beta_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

