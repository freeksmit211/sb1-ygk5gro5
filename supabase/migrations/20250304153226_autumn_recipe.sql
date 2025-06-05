-- First convert status to text to avoid type issues
ALTER TABLE outstanding_invoices 
ALTER COLUMN status TYPE text;

-- Drop the existing status check constraint
ALTER TABLE outstanding_invoices
DROP CONSTRAINT IF EXISTS outstanding_invoices_status_check;

-- Update existing statuses
UPDATE outstanding_invoices
SET status = CASE status
  WHEN 'pending' THEN 'new'
  WHEN 'paid' THEN 'paid'
  ELSE 'new'
END;

-- Add new status check constraint
ALTER TABLE outstanding_invoices
ADD CONSTRAINT outstanding_invoices_status_check
CHECK (status IN ('new', 'awaiting-approval', 'approved', 'paid', 'overdue', 'cancelled'));

-- Add notes table for orders
CREATE TABLE IF NOT EXISTS order_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES outstanding_orders(id) ON DELETE CASCADE,
  note text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add notes table for repairs
CREATE TABLE IF NOT EXISTS repair_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  repair_id uuid REFERENCES repairs(id) ON DELETE CASCADE,
  note text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE order_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for order notes"
  ON order_notes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for order notes"
  ON order_notes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable read access for repair notes"
  ON repair_notes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for repair notes"
  ON repair_notes FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_order_notes_order_id ON order_notes(order_id);
CREATE INDEX idx_repair_notes_repair_id ON repair_notes(repair_id);

-- Create updated_at triggers
CREATE TRIGGER update_order_notes_updated_at
  BEFORE UPDATE ON order_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_repair_notes_updated_at
  BEFORE UPDATE ON repair_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();