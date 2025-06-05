-- First create the auth user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  role,
  confirmation_token
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'test@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object(
    'name', 'Test',
    'surname', 'User',
    'role', 'superAdmin'
  ),
  now(),
  now(),
  'authenticated',
  encode(gen_random_bytes(32), 'hex')
)
ON CONFLICT (id) DO UPDATE
SET 
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data;

-- Then create the public user record
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