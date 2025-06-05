-- Create vehicle inspections table
CREATE TABLE IF NOT EXISTS vehicle_inspections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date timestamptz NOT NULL,
  vehicle text NOT NULL,
  driver text NOT NULL,
  mileage integer NOT NULL CHECK (mileage >= 0),
  items jsonb NOT NULL DEFAULT '{}'::jsonb,
  notes text,
  damage_photos text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Add constraints
  CONSTRAINT valid_items CHECK (jsonb_typeof(items) = 'object'),
  CONSTRAINT valid_vehicle CHECK (vehicle ~ '^[A-Z]{3} [0-9]{3} MP$')
);

-- Enable RLS
ALTER TABLE vehicle_inspections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all vehicle inspections"
  ON vehicle_inspections FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create vehicle inspections"
  ON vehicle_inspections FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update vehicle inspections"
  ON vehicle_inspections FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_vehicle_inspections_date ON vehicle_inspections(date);
CREATE INDEX idx_vehicle_inspections_vehicle ON vehicle_inspections(vehicle);
CREATE INDEX idx_vehicle_inspections_mileage ON vehicle_inspections(mileage);

-- Create updated_at trigger
CREATE TRIGGER update_vehicle_inspections_updated_at
  BEFORE UPDATE ON vehicle_inspections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();