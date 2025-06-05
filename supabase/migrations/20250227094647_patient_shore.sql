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