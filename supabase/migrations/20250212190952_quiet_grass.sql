-- Drop existing table and policies if they exist
DROP TABLE IF EXISTS repairs CASCADE;

-- Create repairs table
CREATE TABLE repairs (
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

-- Create RLS policies with unique names
CREATE POLICY "repairs_select_policy_v1"
  ON repairs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "repairs_insert_policy_v1"
  ON repairs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "repairs_update_policy_v1"
  ON repairs FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_repairs_status ON repairs(status);
CREATE INDEX idx_repairs_created_at ON repairs(created_at);

-- Create updated_at trigger
CREATE TRIGGER update_repairs_updated_at
  BEFORE UPDATE ON repairs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();