-- Create delivery status enum
CREATE TYPE delivery_status AS ENUM ('pending', 'delivered');

-- Create calendar_deliveries table
CREATE TABLE calendar_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date timestamptz NOT NULL,
  area text NOT NULL,
  company text NOT NULL,
  vehicle text NOT NULL,
  driver text NOT NULL,
  item text NOT NULL,
  status delivery_status NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Add constraints
  CONSTRAINT future_date CHECK (date >= CURRENT_DATE)
);

-- Enable RLS
ALTER TABLE calendar_deliveries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all deliveries"
  ON calendar_deliveries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create deliveries"
  ON calendar_deliveries FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update deliveries"
  ON calendar_deliveries FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_calendar_deliveries_date ON calendar_deliveries(date);
CREATE INDEX idx_calendar_deliveries_status ON calendar_deliveries(status);
CREATE INDEX idx_calendar_deliveries_driver ON calendar_deliveries(driver);

-- Create updated_at trigger
CREATE TRIGGER update_calendar_deliveries_updated_at
  BEFORE UPDATE ON calendar_deliveries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();