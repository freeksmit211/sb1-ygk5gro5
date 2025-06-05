-- Create vehicles table
CREATE TABLE IF NOT EXISTS sheq_vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES sheq_companies(id) ON DELETE CASCADE,
  registration text NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vehicle permits table
CREATE TABLE IF NOT EXISTS sheq_vehicle_permits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES sheq_vehicles(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  expiry_date timestamptz NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE sheq_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sheq_vehicle_permits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all vehicles"
  ON sheq_vehicles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create vehicles"
  ON sheq_vehicles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update vehicles"
  ON sheq_vehicles FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can view all permits"
  ON sheq_vehicle_permits FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create permits"
  ON sheq_vehicle_permits FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update permits"
  ON sheq_vehicle_permits FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_sheq_vehicles_company_id ON sheq_vehicles(company_id);
CREATE INDEX idx_sheq_vehicle_permits_vehicle_id ON sheq_vehicle_permits(vehicle_id);
CREATE INDEX idx_sheq_vehicle_permits_expiry_date ON sheq_vehicle_permits(expiry_date);

-- Create updated_at triggers
CREATE TRIGGER update_sheq_vehicles_updated_at
  BEFORE UPDATE ON sheq_vehicles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sheq_vehicle_permits_updated_at
  BEFORE UPDATE ON sheq_vehicle_permits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();