-- Add allowed_pages column to users table if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS allowed_pages text[] DEFAULT '{}';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_users_allowed_pages ON users USING gin (allowed_pages);

-- Update existing users with default pages based on their role
CREATE OR REPLACE FUNCTION set_default_allowed_pages()
RETURNS void AS $$
BEGIN
  -- Update superAdmin users
  UPDATE users 
  SET allowed_pages = ARRAY[
    '/', '/management', '/management/portal', '/sales', '/sales-accounts',
    '/projects', '/admin', '/sheq', '/invoices', '/notices', '/contacts',
    '/deliveries', '/meetings', '/forms', '/stock', '/todo', '/whatsapp'
  ]
  WHERE role = 'superAdmin' AND (allowed_pages IS NULL OR allowed_pages = '{}');

  -- Update management users
  UPDATE users 
  SET allowed_pages = ARRAY[
    '/', '/management', '/management/portal', '/sales', '/sales-accounts',
    '/invoices', '/notices'
  ]
  WHERE role = 'management' AND (allowed_pages IS NULL OR allowed_pages = '{}');

  -- Update admin users
  UPDATE users 
  SET allowed_pages = ARRAY[
    '/', '/admin', '/forms', '/deliveries', '/stock', '/invoices'
  ]
  WHERE role = 'admin' AND (allowed_pages IS NULL OR allowed_pages = '{}');

  -- Update salesFreek users
  UPDATE users 
  SET allowed_pages = ARRAY[
    '/', '/sales', '/sales-accounts', '/contacts', '/meetings', '/todo/freek'
  ]
  WHERE role = 'salesFreek' AND (allowed_pages IS NULL OR allowed_pages = '{}');

  -- Update salesFranco users
  UPDATE users 
  SET allowed_pages = ARRAY[
    '/', '/sales', '/sales-accounts', '/contacts', '/meetings', '/todo/franco'
  ]
  WHERE role = 'salesFranco' AND (allowed_pages IS NULL OR allowed_pages = '{}');

  -- Update salesJeckie users
  UPDATE users 
  SET allowed_pages = ARRAY[
    '/', '/sales', '/sales-accounts', '/contacts', '/meetings', '/todo/jeckie'
  ]
  WHERE role = 'salesJeckie' AND (allowed_pages IS NULL OR allowed_pages = '{}');

  -- Update safety users
  UPDATE users 
  SET allowed_pages = ARRAY['/', '/sheq']
  WHERE role = 'safety' AND (allowed_pages IS NULL OR allowed_pages = '{}');

  -- Update projects users
  UPDATE users 
  SET allowed_pages = ARRAY['/', '/projects', '/todo/sts']
  WHERE role = 'projects' AND (allowed_pages IS NULL OR allowed_pages = '{}');
END;
$$ LANGUAGE plpgsql;

-- Execute the function to update existing users
SELECT set_default_allowed_pages();

-- Drop the function since we don't need it anymore
DROP FUNCTION set_default_allowed_pages();