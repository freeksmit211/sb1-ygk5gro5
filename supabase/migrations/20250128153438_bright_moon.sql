-- Create vehicle incidents table if it doesn't exist
CREATE TABLE IF NOT EXISTS vehicle_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date timestamptz NOT NULL,
  vehicle text NOT NULL,
  driver text NOT NULL,
  location text NOT NULL,
  description text NOT NULL,
  damage_photos text[] DEFAULT '{}',
  status text NOT NULL CHECK (status IN ('pending', 'reviewed', 'resolved')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Drop existing constraint if it exists
ALTER TABLE vehicle_incidents 
DROP CONSTRAINT IF EXISTS valid_vehicle_registration;

-- Add registration format constraint
ALTER TABLE vehicle_incidents
ADD CONSTRAINT valid_vehicle_registration 
CHECK (vehicle ~ '^[A-Z]{3} [0-9]{3} MP$');

-- Enable RLS
ALTER TABLE vehicle_incidents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all vehicle incidents" ON vehicle_incidents;
DROP POLICY IF EXISTS "Users can create vehicle incidents" ON vehicle_incidents;
DROP POLICY IF EXISTS "Users can update vehicle incidents" ON vehicle_incidents;

-- Create RLS policies
CREATE POLICY "Users can view all vehicle incidents"
  ON vehicle_incidents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create vehicle incidents"
  ON vehicle_incidents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update vehicle incidents"
  ON vehicle_incidents FOR UPDATE
  TO authenticated
  USING (true);

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_vehicle_incidents_date;
DROP INDEX IF EXISTS idx_vehicle_incidents_vehicle;
DROP INDEX IF EXISTS idx_vehicle_incidents_status;

-- Create indexes
CREATE INDEX idx_vehicle_incidents_date ON vehicle_incidents(date);
CREATE INDEX idx_vehicle_incidents_vehicle ON vehicle_incidents(vehicle);
CREATE INDEX idx_vehicle_incidents_status ON vehicle_incidents(status);

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_vehicle_incidents_updated_at ON vehicle_incidents;

-- Create updated_at trigger
CREATE TRIGGER update_vehicle_incidents_updated_at
  BEFORE UPDATE ON vehicle_incidents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();