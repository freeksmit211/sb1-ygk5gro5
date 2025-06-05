-- Drop and recreate vehicle_licenses table
DROP TABLE IF EXISTS vehicle_licenses CASCADE;

CREATE TABLE vehicle_licenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle text NOT NULL CHECK (vehicle ~ '^[A-Z]{3} [0-9]{3} MP$'),
  expiry_date timestamptz NOT NULL,
  renewal_reminder_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Add unique constraint on vehicle
  CONSTRAINT unique_vehicle_license UNIQUE (vehicle),
  
  -- Add foreign key constraint to vehicles table
  CONSTRAINT vehicle_licenses_vehicle_fkey 
    FOREIGN KEY (vehicle) 
    REFERENCES vehicles(registration) 
    ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE vehicle_licenses ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "Enable delete access for vehicle licenses"
  ON vehicle_licenses FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_vehicle_licenses_vehicle ON vehicle_licenses(vehicle);
CREATE INDEX idx_vehicle_licenses_expiry_date ON vehicle_licenses(expiry_date);

-- Create updated_at trigger
CREATE TRIGGER update_vehicle_licenses_updated_at
  BEFORE UPDATE ON vehicle_licenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Recreate the license_renewal_alerts view
CREATE OR REPLACE VIEW license_renewal_alerts AS
SELECT *
FROM vehicle_licenses
WHERE 
  expiry_date <= CURRENT_DATE + INTERVAL '30 days'
  AND NOT renewal_reminder_sent
ORDER BY expiry_date ASC;