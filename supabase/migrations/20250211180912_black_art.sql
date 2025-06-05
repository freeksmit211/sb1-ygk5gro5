-- Update permissions for specific management users
UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object(
  'name', COALESCE(raw_user_meta_data->>'name', ''),
  'surname', COALESCE(raw_user_meta_data->>'surname', ''),
  'role', 'management'
)
WHERE email IN (
  'cindy.geldenhuys@simotech.com',
  'daan@simotech.com',
  'leon.vandenberg@simotech.com',
  'freek.smit@simotech.com',
  'freeksmit211@gmail.com'
);

-- Update corresponding public users
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

-- Ensure the users exist in the public users table
INSERT INTO users (
  id,
  email,
  name,
  surname,
  role,
  allowed_pages
)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'name', ''),
  COALESCE(raw_user_meta_data->>'surname', ''),
  'management',
  ARRAY[
    '/', '/management', '/management/portal', '/sales', '/sales-accounts',
    '/invoices', '/notices', '/sales-accounts/ytd',
    '/sales-accounts/franco/ytd', '/sales-accounts/freek/ytd', '/sales-accounts/jeckie/ytd'
  ]
FROM auth.users
WHERE email IN (
  'cindy.geldenhuys@simotech.com',
  'daan@simotech.com',
  'leon.vandenberg@simotech.com',
  'freek.smit@simotech.com',
  'freeksmit211@gmail.com'
)
ON CONFLICT (id) DO UPDATE
SET
  role = 'management',
  allowed_pages = ARRAY[
    '/', '/management', '/management/portal', '/sales', '/sales-accounts',
    '/invoices', '/notices', '/sales-accounts/ytd',
    '/sales-accounts/franco/ytd', '/sales-accounts/freek/ytd', '/sales-accounts/jeckie/ytd'
  ];