-- First update existing users to have correct roles
UPDATE users
SET role = 'salesFranco'
WHERE role = 'S01';

UPDATE users
SET role = 'salesFreek'
WHERE role = 'S03';

UPDATE users
SET role = 'salesJeckie'
WHERE role = 'S05';

-- Drop and recreate the role constraint with correct values
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users 
ADD CONSTRAINT users_role_check 
CHECK (role IN (
  'superAdmin',
  'management',
  'admin',
  'salesFranco',
  'salesFreek',
  'salesJeckie',
  'safety',
  'projects',
  'deleted'
));

-- Update the handle_new_user function to map sales rep codes to proper roles
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  proper_role text;
BEGIN
  -- Map sales rep codes to proper roles
  proper_role := CASE COALESCE(NEW.raw_user_meta_data->>'role', 'admin')
    WHEN 'S01' THEN 'salesFranco'
    WHEN 'S03' THEN 'salesFreek'
    WHEN 'S05' THEN 'salesJeckie'
    ELSE COALESCE(NEW.raw_user_meta_data->>'role', 'admin')
  END;

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
    proper_role,
    CASE proper_role
      WHEN 'superAdmin' THEN ARRAY[
        '/', '/management', '/management/portal', '/sales', '/sales-accounts',
        '/projects', '/admin', '/sheq', '/invoices', '/notices', '/contacts',
        '/deliveries', '/meetings', '/forms', '/stock', '/todo/franco', '/todo/freek',
        '/todo/jeckie', '/todo/sts', '/whatsapp', '/sales-accounts/ytd',
        '/sales-accounts/franco/ytd', '/sales-accounts/freek/ytd', '/sales-accounts/jeckie/ytd'
      ]
      WHEN 'management' THEN ARRAY[
        '/', '/management', '/management/portal', '/sales', '/sales-accounts',
        '/invoices', '/notices', '/sales-accounts/ytd',
        '/sales-accounts/franco/ytd', '/sales-accounts/freek/ytd', '/sales-accounts/jeckie/ytd'
      ]
      WHEN 'salesFranco' THEN ARRAY[
        '/', '/sales', '/sales-accounts', '/contacts', '/meetings', '/todo/franco',
        '/sales-accounts/franco/ytd', '/projects', '/admin', '/sheq', '/invoices',
        '/notices', '/vehicles'
      ]
      WHEN 'salesFreek' THEN ARRAY[
        '/', '/sales', '/sales-accounts', '/contacts', '/meetings', '/todo/freek',
        '/sales-accounts/freek/ytd', '/projects', '/admin', '/sheq', '/invoices',
        '/notices', '/vehicles'
      ]
      WHEN 'salesJeckie' THEN ARRAY[
        '/', '/sales', '/sales-accounts', '/contacts', '/meetings', '/todo/jeckie',
        '/sales-accounts/jeckie/ytd', '/projects', '/admin', '/sheq', '/invoices',
        '/notices', '/vehicles'
      ]
      WHEN 'admin' THEN ARRAY[
        '/', '/admin', '/forms', '/deliveries', '/stock', '/invoices',
        '/notices', '/contacts', '/vehicles'
      ]
      WHEN 'projects' THEN ARRAY[
        '/', '/projects', '/contacts', '/sheq', '/todo/sts'
      ]
      WHEN 'safety' THEN ARRAY[
        '/', '/sheq'
      ]
      ELSE ARRAY['/']
    END
  );
  RETURN NEW;
END;
$$;