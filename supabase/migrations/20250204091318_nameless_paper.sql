-- Create vehicle licenses table
CREATE TABLE IF NOT EXISTS vehicle_licenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle text NOT NULL CHECK (vehicle ~ '^[A-Z]{3} [0-9]{3} MP$'),
  license_number text NOT NULL,
  expiry_date timestamptz NOT NULL,
  renewal_reminder_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Add constraints
  CONSTRAINT future_expiry CHECK (expiry_date > created_at)
);

-- Enable RLS
ALTER TABLE vehicle_licenses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all vehicle licenses"
  ON vehicle_licenses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create vehicle licenses"
  ON vehicle_licenses FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update vehicle licenses"
  ON vehicle_licenses FOR UPDATE
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