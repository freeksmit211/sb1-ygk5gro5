-- Add allocated_to column to vehicles table
ALTER TABLE vehicles
ADD COLUMN allocated_to text;

-- Create index for better query performance
CREATE INDEX idx_vehicles_allocated_to ON vehicles(allocated_to);

-- Update RLS policies to allow access to the new column
DROP POLICY IF EXISTS "Enable read access for vehicles" ON vehicles;
DROP POLICY IF EXISTS "Enable insert access for vehicles" ON vehicles;
DROP POLICY IF EXISTS "Enable update access for vehicles" ON vehicles;
DROP POLICY IF EXISTS "Enable delete access for vehicles" ON vehicles;

CREATE POLICY "Enable read access for vehicles"
  ON vehicles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for vehicles"
  ON vehicles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for vehicles"
  ON vehicles FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete access for vehicles"
  ON vehicles FOR DELETE
  TO authenticated
  USING (true);

-- Add check constraint to validate allocated_to against valid names
ALTER TABLE vehicles
ADD CONSTRAINT valid_allocated_to CHECK (
  allocated_to IS NULL OR 
  allocated_to IN (
    'Angilique', 'Billy', 'Chanell', 'Cindy', 'Daan', 'Elize',
    'Franco', 'Freek', 'Izahn', 'Jeckie', 'Leon', 'Matthews', 'Petros'
  )
);