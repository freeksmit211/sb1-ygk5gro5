-- Update RLS policies to be more permissive
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role bypass" ON users;
CREATE POLICY "Service role bypass"
  ON users
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view all users" ON users;
CREATE POLICY "Users can view all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can update users" ON users;
CREATE POLICY "Users can update users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('superAdmin', 'management')
    )
  );

DROP POLICY IF EXISTS "Users can insert users" ON users;
CREATE POLICY "Users can insert users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('superAdmin', 'management')
    )
  );

-- Grant necessary permissions
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO service_role;