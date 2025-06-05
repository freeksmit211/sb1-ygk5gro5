-- Update Leon's permissions in auth.users
UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object(
  'name', COALESCE(raw_user_meta_data->>'name', 'Leon'),
  'surname', COALESCE(raw_user_meta_data->>'surname', 'van der Berg'),
  'role', 'superAdmin',
  'allowed_pages', ARRAY[
    '/', '/management', '/management/portal', '/sales', '/sales-accounts',
    '/projects', '/admin', '/sheq', '/invoices', '/notices', '/contacts',
    '/deliveries', '/meetings', '/forms', '/stock', '/todo/franco', '/todo/freek',
    '/todo/jeckie', '/todo/sts', '/whatsapp', '/sales-accounts/ytd',
    '/sales-accounts/franco/ytd', '/sales-accounts/freek/ytd', '/sales-accounts/jeckie/ytd',
    '/vehicles', '/vehicles/pool', '/vehicles/service', '/vehicles/license'
  ]
)
WHERE email = 'leon.vandenberg@simotech.com';

-- Update Leon's permissions in public.users
UPDATE users
SET 
  role = 'superAdmin',
  allowed_pages = ARRAY[
    '/', '/management', '/management/portal', '/sales', '/sales-accounts',
    '/projects', '/admin', '/sheq', '/invoices', '/notices', '/contacts',
    '/deliveries', '/meetings', '/forms', '/stock', '/todo/franco', '/todo/freek',
    '/todo/jeckie', '/todo/sts', '/whatsapp', '/sales-accounts/ytd',
    '/sales-accounts/franco/ytd', '/sales-accounts/freek/ytd', '/sales-accounts/jeckie/ytd',
    '/vehicles', '/vehicles/pool', '/vehicles/service', '/vehicles/license'
  ]
WHERE email = 'leon.vandenberg@simotech.com';

-- If Leon's user doesn't exist, create it
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
  COALESCE(raw_user_meta_data->>'name', 'Leon'),
  COALESCE(raw_user_meta_data->>'surname', 'van der Berg'),
  'superAdmin',
  ARRAY[
    '/', '/management', '/management/portal', '/sales', '/sales-accounts',
    '/projects', '/admin', '/sheq', '/invoices', '/notices', '/contacts',
    '/deliveries', '/meetings', '/forms', '/stock', '/todo/franco', '/todo/freek',
    '/todo/jeckie', '/todo/sts', '/whatsapp', '/sales-accounts/ytd',
    '/sales-accounts/franco/ytd', '/sales-accounts/freek/ytd', '/sales-accounts/jeckie/ytd',
    '/vehicles', '/vehicles/pool', '/vehicles/service', '/vehicles/license'
  ]
FROM auth.users
WHERE email = 'leon.vandenberg@simotech.com'
ON CONFLICT (id) DO UPDATE
SET
  role = 'superAdmin',
  allowed_pages = EXCLUDED.allowed_pages;