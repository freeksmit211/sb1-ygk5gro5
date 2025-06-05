-- Create repairs table if it doesn't exist
CREATE TABLE IF NOT EXISTS repairs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  job_number text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'in-progress', 'awaiting-parts', 'complete')),
  item_description text NOT NULL,
  repair_description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for repairs"
  ON repairs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for repairs"
  ON repairs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for repairs"
  ON repairs FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_repairs_status ON repairs(status);
CREATE INDEX IF NOT EXISTS idx_repairs_created_at ON repairs(created_at);

-- Create updated_at trigger
DROP TRIGGER IF EXISTS update_repairs_updated_at ON repairs;
CREATE TRIGGER update_repairs_updated_at
  BEFORE UPDATE ON repairs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();