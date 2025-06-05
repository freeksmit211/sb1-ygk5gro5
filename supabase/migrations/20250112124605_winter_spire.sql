-- Create function to update user with transaction
CREATE OR REPLACE FUNCTION update_user(
  p_user_id uuid,
  p_name text DEFAULT NULL,
  p_role text DEFAULT NULL,
  p_password text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update auth user if name or role changes
  IF p_name IS NOT NULL OR p_role IS NOT NULL THEN
    UPDATE auth.users
    SET raw_user_meta_data = jsonb_set(
      COALESCE(raw_user_meta_data, '{}'::jsonb),
      '{name}',
      to_jsonb(COALESCE(p_name, raw_user_meta_data->>'name'))
    )
    WHERE id = p_user_id;
  END IF;

  -- Update password if provided
  IF p_password IS NOT NULL THEN
    -- Use auth.users password update function
    PERFORM auth.change_user_password(p_user_id, p_password);
  END IF;

  -- Update user record
  UPDATE users
  SET
    name = COALESCE(p_name, name),
    role = COALESCE(p_role, role),
    updated_at = now()
  WHERE id = p_user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_user TO authenticated;

-- Add unique constraint on email if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'users_email_key'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);
  END IF;
END $$;

-- Update role check constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('superAdmin', 'management', 'admin', 'salesFreek', 'salesFranco', 'salesJeckie'));