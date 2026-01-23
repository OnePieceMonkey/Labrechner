-- Migration: Add user roles for RBAC
-- Date: 2026-01-23
-- Description: Adds role field to user_settings for Admin/Beta access control

-- 1. Add role column to user_settings
ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- 2. Add check constraint for valid roles
ALTER TABLE user_settings
ADD CONSTRAINT user_settings_role_check
CHECK (role IN ('user', 'admin', 'beta_tester'));

-- 3. Create index for role lookups
CREATE INDEX IF NOT EXISTS idx_user_settings_role ON user_settings(role);

-- 4. Set admin role for specific user (werle.business@gmail.com)
-- Note: This runs after user has logged in at least once
UPDATE user_settings
SET role = 'admin'
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'werle.business@gmail.com'
);

-- 5. Create helper function to check admin status
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_settings
    WHERE user_id = user_uuid AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create helper function to check beta access
CREATE OR REPLACE FUNCTION has_beta_access(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_settings
    WHERE user_id = user_uuid AND role IN ('admin', 'beta_tester')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Update RLS policies to consider admin role
-- Admins can view all user_settings (for debugging/support)
DROP POLICY IF EXISTS "Admins can view all settings" ON user_settings;
CREATE POLICY "Admins can view all settings" ON user_settings
FOR SELECT USING (
  is_admin(auth.uid()) OR auth.uid() = user_id
);

-- Comment for documentation
COMMENT ON COLUMN user_settings.role IS 'User role: user (default), admin (full access), beta_tester (early access)';
