-- Drop and recreate vehicles table
DROP TABLE IF EXISTS vehicles CASCADE;

CREATE TABLE vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration text NOT NULL CHECK (registration ~ '^[A-Z]{3} [0-9]{3} MP$'),
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL CHECK (year >= 1900 AND year <= extract(year from now()) + 1),
  status text NOT NULL CHECK (status IN ('active', 'maintenance', 'retired')) DEFAULT 'active',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Add unique constraint on registration
  CONSTRAINT unique_vehicle_registration UNIQUE (registration)
);

-- Enable RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for vehicles"
  ON vehicles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for vehicles"
  ON vehicles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for vehicles"
  ON vehicles FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete access for vehicles"
  ON vehicles FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_vehicles_registration ON vehicles(registration);
CREATE INDEX idx_vehicles_status ON vehicles(status);

-- Create updated_at trigger
CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();