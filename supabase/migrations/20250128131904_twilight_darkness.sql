-- Update default allowed pages for roles
CREATE OR REPLACE FUNCTION set_default_allowed_pages()
RETURNS void AS $$
BEGIN
  -- Update superAdmin users
  UPDATE users 
  SET allowed_pages = ARRAY[
    '/', '/management', '/management/portal', '/sales', '/sales-accounts',
    '/projects', '/admin', '/sheq', '/invoices', '/notices', '/contacts',
    '/deliveries', '/meetings', '/forms', '/stock', '/todo', '/whatsapp',
    '/sales-accounts/ytd'
  ]
  WHERE role = 'superAdmin';

  -- Update management users
  UPDATE users 
  SET allowed_pages = ARRAY[
    '/', '/management', '/management/portal', '/sales', '/sales-accounts',
    '/invoices', '/notices', '/sales-accounts/ytd'
  ]
  WHERE role = 'management';

  -- Update sales users
  UPDATE users 
  SET allowed_pages = array_append(allowed_pages, '/sales-accounts/ytd')
  WHERE role IN ('salesFreek', 'salesFranco', 'salesJeckie')
  AND '/sales-accounts/ytd' != ALL(allowed_pages);
END;
$$ LANGUAGE plpgsql;

-- Execute the function to update existing users
SELECT set_default_allowed_pages();

-- Update test user specifically
UPDATE users
SET allowed_pages = array_append(allowed_pages, '/sales-accounts/ytd')
WHERE id = '00000000-0000-0000-0000-000000000001'
AND '/sales-accounts/ytd' != ALL(allowed_pages);

-- Drop the function
DROP FUNCTION set_default_allowed_pages();