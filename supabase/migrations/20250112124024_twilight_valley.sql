/*
  # Update User Roles and Permissions

  1. Changes
    - Update user roles to include specific sales roles
    - Add default page permissions for each role
    - Add initial super admin user for freek.smit@simotech.com

  2. Security
    - Maintain existing RLS policies
    - Add role-specific page access
*/

-- Update existing user roles
UPDATE users 
SET role = 'superAdmin'
WHERE email = 'freek.smit@simotech.com';

-- Create function to get default pages for role
CREATE OR REPLACE FUNCTION get_default_pages_for_role(role_name text)
RETURNS text[] AS $$
BEGIN
  CASE role_name
    WHEN 'superAdmin' THEN
      RETURN ARRAY[
        '/', '/management', '/management/portal', '/sales', '/sales-accounts',
        '/projects', '/admin', '/sheq', '/invoices', '/notices', '/contacts',
        '/deliveries', '/meetings', '/forms', '/stock'
      ];
    WHEN 'management' THEN
      RETURN ARRAY['/management', '/management/portal', '/sales', '/sales-accounts'];
    WHEN 'admin' THEN
      RETURN ARRAY['/admin', '/forms', '/deliveries', '/stock', '/invoices'];
    WHEN 'salesFreek' THEN
      RETURN ARRAY['/sales', '/sales-accounts', '/contacts', '/meetings'];
    WHEN 'salesFranco' THEN
      RETURN ARRAY['/sales', '/sales-accounts', '/contacts', '/meetings'];
    WHEN 'salesJeckie' THEN
      RETURN ARRAY['/sales', '/sales-accounts', '/contacts', '/meetings'];
    ELSE
      RETURN ARRAY[]::text[];
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Update allowed_pages for existing users based on their roles
UPDATE users
SET allowed_pages = get_default_pages_for_role(role)
WHERE allowed_pages IS NULL OR allowed_pages = '{}';

-- Create trigger to set default pages on user creation
CREATE OR REPLACE FUNCTION set_default_pages()
RETURNS TRIGGER AS $$
BEGIN
  NEW.allowed_pages = get_default_pages_for_role(NEW.role);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_default_pages_trigger
  BEFORE INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION set_default_pages();