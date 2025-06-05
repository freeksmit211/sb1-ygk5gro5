-- Add surname column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS surname text NOT NULL DEFAULT '';

-- Update role enum to include new roles
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users 
ADD CONSTRAINT users_role_check 
CHECK (role IN (
  'superAdmin',
  'management',
  'admin',
  'salesFreek',
  'salesFranco',
  'salesJeckie',
  'safety',
  'projects'
));

-- Create admin functions for user management
CREATE OR REPLACE FUNCTION is_admin_user(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = user_id
    AND role IN ('superAdmin', 'management')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view all users" ON users;
DROP POLICY IF EXISTS "Users can update users" ON users;
DROP POLICY IF EXISTS "Users can insert users" ON users;

CREATE POLICY "Users can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update users"
  ON users FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id OR 
    is_admin_user(auth.uid())
  );

CREATE POLICY "Users can insert users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    is_admin_user(auth.uid())
  );

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION is_admin_user TO authenticated;