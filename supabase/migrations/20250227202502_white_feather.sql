-- Create pool vehicles table
CREATE TABLE IF NOT EXISTS pool_vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration text NOT NULL CHECK (registration ~ '^[A-Z]{3} [0-9]{3} MP$'),
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL CHECK (year >= 1900 AND year <= extract(year from now()) + 1),
  status text NOT NULL CHECK (status IN ('available', 'booked', 'maintenance')) DEFAULT 'available',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Add unique constraint on registration
  CONSTRAINT unique_pool_vehicle_registration UNIQUE (registration)
);

-- Create vehicle bookings table
CREATE TABLE IF NOT EXISTS vehicle_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES pool_vehicles(id) ON DELETE CASCADE,
  employee_id text NOT NULL,
  employee_name text NOT NULL,
  start_date timestamptz NOT NULL DEFAULT now(),
  end_date timestamptz,
  pin text,
  status text NOT NULL CHECK (status IN ('pending', 'active', 'completed')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Add constraint to ensure end_date is after start_date
  CONSTRAINT valid_booking_dates CHECK (end_date IS NULL OR end_date > start_date)
);

-- Add unique constraint for active bookings
CREATE UNIQUE INDEX idx_unique_active_booking 
ON vehicle_bookings (vehicle_id)
WHERE status = 'active';

-- Enable RLS
ALTER TABLE pool_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_bookings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for pool_vehicles
CREATE POLICY "Enable read access for pool vehicles"
  ON pool_vehicles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for pool vehicles"
  ON pool_vehicles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for pool vehicles"
  ON pool_vehicles FOR UPDATE
  TO authenticated
  USING (true);

-- Create RLS policies for vehicle_bookings
CREATE POLICY "Enable read access for vehicle bookings"
  ON vehicle_bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for vehicle bookings"
  ON vehicle_bookings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for vehicle bookings"
  ON vehicle_bookings FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_pool_vehicles_status ON pool_vehicles(status);
CREATE INDEX idx_vehicle_bookings_vehicle_id ON vehicle_bookings(vehicle_id);
CREATE INDEX idx_vehicle_bookings_status ON vehicle_bookings(status);
CREATE INDEX idx_vehicle_bookings_dates ON vehicle_bookings(start_date, end_date);

-- Create updated_at triggers
CREATE TRIGGER update_pool_vehicles_updated_at
  BEFORE UPDATE ON pool_vehicles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicle_bookings_updated_at
  BEFORE UPDATE ON vehicle_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();