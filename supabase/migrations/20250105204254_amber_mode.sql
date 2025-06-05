-- Enable auth schema extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create auth tables
CREATE TABLE IF NOT EXISTS auth.users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  encrypted_password text NOT NULL,
  name text,
  role text CHECK (role IN ('superAdmin', 'management', 'officeAdmin', 'sales')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create RLS policies
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own data"
  ON auth.users
  FOR SELECT
  USING (auth.uid() = id);

-- Create auth functions
CREATE OR REPLACE FUNCTION auth.check_role(
  required_role text,
  user_role text
) RETURNS boolean AS $$
BEGIN
  -- Add role hierarchy checks here
  RETURN user_role = required_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION auth.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_auth_users_updated_at
  BEFORE UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auth.update_updated_at();