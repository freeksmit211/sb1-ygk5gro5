-- Create sales rep allocations table
CREATE TABLE IF NOT EXISTS sales_rep_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL CHECK (code IN ('SO1', 'SO3', 'SO5')),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Add unique constraint on code
  CONSTRAINT unique_sales_rep_code UNIQUE (code)
);

-- Enable RLS
ALTER TABLE sales_rep_allocations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all sales rep allocations"
  ON sales_rep_allocations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create sales rep allocations"
  ON sales_rep_allocations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update sales rep allocations"
  ON sales_rep_allocations FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_sales_rep_allocations_code ON sales_rep_allocations(code);

-- Create updated_at trigger
CREATE TRIGGER update_sales_rep_allocations_updated_at
  BEFORE UPDATE ON sales_rep_allocations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();