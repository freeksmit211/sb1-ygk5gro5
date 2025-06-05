-- Create function to check if user can manage vehicle licenses
CREATE OR REPLACE FUNCTION can_manage_vehicle_licenses(user_id uuid)
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = user_id
    AND role IN ('superAdmin', 'management')
  );
END;
$$;

-- Update RLS policies for vehicle_licenses
DROP POLICY IF EXISTS "Enable delete access for vehicle licenses" ON vehicle_licenses;

CREATE POLICY "Enable delete access for vehicle licenses"
  ON vehicle_licenses FOR DELETE
  TO authenticated
  USING (
    can_manage_vehicle_licenses(auth.uid())
  );

-- Grant execute permission
GRANT EXECUTE ON FUNCTION can_manage_vehicle_licenses TO authenticated;