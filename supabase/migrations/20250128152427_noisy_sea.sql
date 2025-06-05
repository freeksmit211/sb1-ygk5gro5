-- Create maintenance schedules table
CREATE TABLE IF NOT EXISTS maintenance_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('light', 'aircon', 'earth')),
  completion_date timestamptz NOT NULL,
  notes text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE maintenance_schedules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all maintenance schedules"
  ON maintenance_schedules FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create maintenance schedules"
  ON maintenance_schedules FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update maintenance schedules"
  ON maintenance_schedules FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_maintenance_schedules_type ON maintenance_schedules(type);
CREATE INDEX idx_maintenance_schedules_completion_date ON maintenance_schedules(completion_date);

-- Create updated_at trigger
CREATE TRIGGER update_maintenance_schedules_updated_at
  BEFORE UPDATE ON maintenance_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();