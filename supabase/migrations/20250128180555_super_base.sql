-- First disable RLS temporarily to avoid conflicts
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON users;
DROP POLICY IF EXISTS "Enable self-update for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable admin management" ON users;
DROP POLICY IF EXISTS "Service role has full access" ON users;
DROP POLICY IF EXISTS "Service role full access" ON users;
DROP POLICY IF EXISTS "Service role bypass" ON users;

-- Create service role policy first
CREATE POLICY "service_role_access"
  ON users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create authenticated user policies
CREATE POLICY "authenticated_read"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "authenticated_insert"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.uid()
      AND (
        raw_user_meta_data->>'role' = 'superAdmin' OR
        raw_user_meta_data->>'role' = 'management'
      )
    )
  );

CREATE POLICY "authenticated_update"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.uid()
      AND (
        raw_user_meta_data->>'role' = 'superAdmin' OR
        raw_user_meta_data->>'role' = 'management'
      )
    )
  )
  WITH CHECK (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.uid()
      AND (
        raw_user_meta_data->>'role' = 'superAdmin' OR
        raw_user_meta_data->>'role' = 'management'
      )
    )
  );

CREATE POLICY "authenticated_delete"
  ON users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.uid()
      AND (
        raw_user_meta_data->>'role' = 'superAdmin' OR
        raw_user_meta_data->>'role' = 'management'
      )
    )
  );

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Grant proper permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO service_role;

-- Create function to sync auth users to public users
CREATE OR REPLACE FUNCTION sync_user_from_auth()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    name,
    surname,
    role,
    allowed_pages
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'surname', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin'),
    COALESCE(NEW.raw_user_meta_data->>'allowed_pages', NULL)::text[]
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    surname = EXCLUDED.surname,
    role = EXCLUDED.role,
    allowed_pages = EXCLUDED.allowed_pages,
    updated_at = now();
  
  RETURN NEW;
END;
$$;

-- Create or replace the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_from_auth();