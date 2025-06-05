-- Add unique constraint on vehicle if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'unique_vehicle_license'
  ) THEN
    ALTER TABLE vehicle_licenses
    ADD CONSTRAINT unique_vehicle_license UNIQUE (vehicle);
  END IF;
END $$;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all vehicle licenses" ON vehicle_licenses;
DROP POLICY IF EXISTS "Users can create vehicle licenses" ON vehicle_licenses;
DROP POLICY IF EXISTS "Users can update vehicle licenses" ON vehicle_licenses;

-- Create RLS policies
CREATE POLICY "Enable read access for vehicle licenses"
  ON vehicle_licenses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for vehicle licenses"
  ON vehicle_licenses FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for vehicle licenses"
  ON vehicle_licenses FOR UPDATE
  TO authenticated
  USING (true);

-- Create or replace indexes
DROP INDEX IF EXISTS idx_vehicle_licenses_vehicle;
DROP INDEX IF EXISTS idx_vehicle_licenses_expiry_date;

CREATE INDEX idx_vehicle_licenses_vehicle ON vehicle_licenses(vehicle);
CREATE INDEX idx_vehicle_licenses_expiry_date ON vehicle_licenses(expiry_date);