-- Create the public user record only
INSERT INTO public.users (id, email, name, surname, role, allowed_pages)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'test@example.com',
  'Test',
  'User',
  'superAdmin',
  ARRAY[
    '/', '/management', '/management/portal', '/sales', '/sales-accounts',
    '/projects', '/admin', '/sheq', '/invoices', '/notices', '/contacts',
    '/deliveries', '/meetings', '/forms', '/stock', '/todo/franco', '/todo/freek',
    '/todo/jeckie', '/todo/sts', '/whatsapp'
  ]
)
ON CONFLICT (id) DO UPDATE
SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  surname = EXCLUDED.surname,
  role = EXCLUDED.role,
  allowed_pages = EXCLUDED.allowed_pages;