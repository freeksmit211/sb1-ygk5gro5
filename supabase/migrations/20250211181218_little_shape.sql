-- First ensure all management users have correct metadata and role
UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object(
  'name', COALESCE(raw_user_meta_data->>'name', ''),
  'surname', COALESCE(raw_user_meta_data->>'surname', ''),
  'role', 'management',
  'allowed_pages', ARRAY[
    '/', '/management', '/management/portal', '/sales', '/sales-accounts',
    '/invoices', '/notices', '/sales-accounts/ytd',
    '/sales-accounts/franco/ytd', '/sales-accounts/freek/ytd', '/sales-accounts/jeckie/ytd'
  ]
)
WHERE email IN (
  'cindy.geldenhuys@simotech.com',
  'daan@simotech.com',
  'leon.vandenberg@simotech.com',
  'freek.smit@simotech.com',
  'freeksmit211@gmail.com'
);

-- Update public users table
UPDATE users
SET 
  role = 'management',
  allowed_pages = ARRAY[
    '/', '/management', '/management/portal', '/sales', '/sales-accounts',
    '/invoices', '/notices', '/sales-accounts/ytd',
    '/sales-accounts/franco/ytd', '/sales-accounts/freek/ytd', '/sales-accounts/jeckie/ytd'
  ]
WHERE email IN (
  'cindy.geldenhuys@simotech.com',
  'daan@simotech.com',
  'leon.vandenberg@simotech.com',
  'freek.smit@simotech.com',
  'freeksmit211@gmail.com'
);

-- Create function to check management access
CREATE OR REPLACE FUNCTION has_management_access(user_id uuid)
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = user_id
    AND (
      role IN ('superAdmin', 'management')
      OR '/management' = ANY(allowed_pages)
    )
  );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION has_management_access TO authenticated;