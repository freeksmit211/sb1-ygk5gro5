-- Create function to handle test user creation
CREATE OR REPLACE FUNCTION create_test_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create the public user record
  INSERT INTO public.users (
    id,
    email,
    name,
    surname,
    role,
    allowed_pages
  )
  VALUES (
    auth.uid(),
    current_setting('request.jwt.claim.email', true),
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
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_test_user TO authenticated;