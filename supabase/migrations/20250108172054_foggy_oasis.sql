-- Create vehicle services table
CREATE TABLE IF NOT EXISTS vehicle_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle text NOT NULL,
  service_km integer NOT NULL CHECK (service_km >= 0),
  next_service_km integer NOT NULL CHECK (next_service_km >= service_km),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Add constraints
  CONSTRAINT valid_vehicle CHECK (vehicle ~ '^[A-Z]{3} [0-9]{3} MP$')
);

-- Enable RLS
ALTER TABLE vehicle_services ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all vehicle services"
  ON vehicle_services FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create vehicle services"
  ON vehicle_services FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update vehicle services"
  ON vehicle_services FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_vehicle_services_vehicle ON vehicle_services(vehicle);
CREATE INDEX idx_vehicle_services_service_km ON vehicle_services(service_km);
CREATE INDEX idx_vehicle_services_next_service_km ON vehicle_services(next_service_km);

-- Create updated_at trigger
CREATE TRIGGER update_vehicle_services_updated_at
  BEFORE UPDATE ON vehicle_services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();