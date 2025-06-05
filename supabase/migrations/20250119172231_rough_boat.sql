-- Create sales rep vehicle allocations table
CREATE TABLE IF NOT EXISTS sales_rep_vehicle_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rep_code text NOT NULL CHECK (rep_code IN ('SO1', 'SO3', 'SO5')),
  vehicle text NOT NULL CHECK (vehicle ~ '^[A-Z]{3} [0-9]{3} MP$'),
  start_date timestamptz NOT NULL DEFAULT now(),
  end_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Add constraints
  CONSTRAINT valid_date_range CHECK (end_date IS NULL OR end_date > start_date),
  CONSTRAINT unique_active_vehicle_allocation UNIQUE NULLS NOT DISTINCT (vehicle, end_date)
);

-- Enable RLS
ALTER TABLE sales_rep_vehicle_allocations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all vehicle allocations"
  ON sales_rep_vehicle_allocations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create vehicle allocations"
  ON sales_rep_vehicle_allocations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update vehicle allocations"
  ON sales_rep_vehicle_allocations FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_vehicle_allocations_rep_code ON sales_rep_vehicle_allocations(rep_code);
CREATE INDEX idx_vehicle_allocations_vehicle ON sales_rep_vehicle_allocations(vehicle);
CREATE INDEX idx_vehicle_allocations_dates ON sales_rep_vehicle_allocations(start_date, end_date);

-- Create updated_at trigger
CREATE TRIGGER update_vehicle_allocations_updated_at
  BEFORE UPDATE ON sales_rep_vehicle_allocations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();