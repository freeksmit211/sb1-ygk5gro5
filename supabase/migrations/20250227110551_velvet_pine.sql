-- First modify the vehicles table to allow NULL values for make and model
-- and add allocated_to field
ALTER TABLE vehicles
ALTER COLUMN make DROP NOT NULL,
ALTER COLUMN model DROP NOT NULL,
ADD COLUMN IF NOT EXISTS allocated_to text CHECK (
  allocated_to IS NULL OR 
  allocated_to IN (
    'Angilique', 'Billy', 'Chanell', 'Cindy', 'Daan', 'Elize',
    'Franco', 'Freek', 'Izahn', 'Jeckie', 'Leon', 'Matthews', 'Petros'
  )
);

-- Insert vehicles with registration numbers and year
INSERT INTO vehicles (registration, year, status)
VALUES 
  ('JTC 430 MP', 2024, 'active'),
  ('KPN 084 MP', 2024, 'active'),
  ('JDT 129 MP', 2024, 'active'),
  ('KPJ 902 MP', 2024, 'active'),
  ('JTC 437 MP', 2024, 'active'),
  ('KZJ 664 MP', 2024, 'active'),
  ('JXZ 199 MP', 2024, 'active'),
  ('KZW 922 MP', 2024, 'active'),
  ('HXJ 207 MP', 2024, 'active'),
  ('KPN 089 MP', 2024, 'active'),
  ('KRP 201 MP', 2024, 'active'),
  ('KRM 836 MP', 2024, 'active'),
  ('KWR 435 MP', 2024, 'active')
ON CONFLICT (registration) 
DO UPDATE SET
  status = EXCLUDED.status,
  make = NULL,
  model = NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_vehicles_allocated_to ON vehicles(allocated_to);

-- Insert sample service data
INSERT INTO vehicle_services (vehicle, service_km, next_service_km, notes)
VALUES
  ('JTC 430 MP', 150000, 160000, 'Regular service completed'),
  ('KPN 084 MP', 145000, 155000, 'Oil change and filters replaced'),
  ('JDT 129 MP', 155000, 165000, 'Brake pads replaced'),
  ('KPJ 902 MP', 140000, 150000, 'Full service completed'),
  ('JTC 437 MP', 148000, 158000, 'Regular maintenance'),
  ('KZJ 664 MP', 152000, 162000, 'Oil and filter change'),
  ('JXZ 199 MP', 147000, 157000, 'Routine service'),
  ('KZW 922 MP', 151000, 161000, 'Full service with brake check'),
  ('HXJ 207 MP', 149000, 159000, 'Regular service'),
  ('KPN 089 MP', 146000, 156000, 'Oil change and inspection'),
  ('KRP 201 MP', 153000, 163000, 'Comprehensive service'),
  ('KRM 836 MP', 144000, 154000, 'Standard service completed'),
  ('KWR 435 MP', 150000, 160000, 'Regular maintenance check')
ON CONFLICT DO NOTHING;