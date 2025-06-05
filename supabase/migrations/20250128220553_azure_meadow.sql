-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create improved function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    name,
    surname,
    role,
    allowed_pages
  )
  VALUES (
    NEW.id,
    LOWER(NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'surname', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin'),
    COALESCE(
      (NEW.raw_user_meta_data->>'allowed_pages')::text[],
      CASE COALESCE(NEW.raw_user_meta_data->>'role', 'admin')
        WHEN 'superAdmin' THEN ARRAY[
          '/', '/management', '/management/portal', '/sales', '/sales-accounts',
          '/projects', '/admin', '/sheq', '/invoices', '/notices', '/contacts',
          '/deliveries', '/meetings', '/forms', '/stock', '/todo/franco', '/todo/freek',
          '/todo/jeckie', '/todo/sts', '/whatsapp'
        ]
        WHEN 'management' THEN ARRAY[
          '/', '/management', '/management/portal', '/sales', '/sales-accounts',
          '/invoices', '/notices'
        ]
        WHEN 'admin' THEN ARRAY[
          '/', '/admin', '/forms', '/deliveries', '/stock', '/invoices'
        ]
        ELSE ARRAY['/']
      END
    )
  );
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Ensure proper permissions
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;