-- Drop existing table
DROP TABLE IF EXISTS outstanding_orders;

-- Create outstanding orders table with JSON lead time
CREATE TABLE IF NOT EXISTS outstanding_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL,
  customer text NOT NULL,
  responsible_person text NOT NULL,
  lead_time jsonb NOT NULL CHECK (
    jsonb_typeof(lead_time) = 'object' AND
    (lead_time->>'unit') IN ('weeks', 'days') AND
    (lead_time->>'value')::numeric > 0
  ),
  notes text,
  status text NOT NULL CHECK (status IN ('pending', 'in-progress', 'complete')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE outstanding_orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for outstanding orders"
  ON outstanding_orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for outstanding orders"
  ON outstanding_orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for outstanding orders"
  ON outstanding_orders FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_outstanding_orders_lead_time ON outstanding_orders USING gin (lead_time);
CREATE INDEX idx_outstanding_orders_status ON outstanding_orders(status);
CREATE INDEX idx_outstanding_orders_created_at ON outstanding_orders(created_at);

-- Create updated_at trigger
CREATE TRIGGER update_outstanding_orders_updated_at
  BEFORE UPDATE ON outstanding_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();