-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration text NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL CHECK (year >= 1900 AND year <= extract(year from now()) + 1),
  status text NOT NULL CHECK (status IN ('active', 'maintenance', 'retired')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add registration format constraint
ALTER TABLE vehicles
ADD CONSTRAINT valid_registration_format 
CHECK (registration ~ '^[A-Z]{3} [0-9]{3} MP$');

-- Add unique constraint on registration
CREATE UNIQUE INDEX idx_vehicles_registration ON vehicles(registration);

-- Enable RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all vehicles"
  ON vehicles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create vehicles"
  ON vehicles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update vehicles"
  ON vehicles FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete vehicles"
  ON vehicles FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_vehicles_status ON vehicles(status);

-- Create updated_at trigger
CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();