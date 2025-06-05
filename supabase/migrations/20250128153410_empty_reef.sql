-- Create vehicles table if it doesn't exist
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

-- Drop existing constraint if it exists
ALTER TABLE vehicles 
DROP CONSTRAINT IF EXISTS valid_registration_format;

-- Add registration format constraint
ALTER TABLE vehicles
ADD CONSTRAINT valid_registration_format 
CHECK (registration ~ '^[A-Z]{3} [0-9]{3} MP$');

-- Drop existing index if it exists
DROP INDEX IF EXISTS idx_unique_vehicle_registration;

-- Add unique constraint on registration
CREATE UNIQUE INDEX idx_unique_vehicle_registration ON vehicles(registration);

-- Enable RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can create vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can update vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can delete vehicles" ON vehicles;

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

-- Drop existing index if it exists
DROP INDEX IF EXISTS idx_vehicles_status;

-- Create indexes
CREATE INDEX idx_vehicles_status ON vehicles(status);

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_vehicles_updated_at ON vehicles;

-- Create updated_at trigger
CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();