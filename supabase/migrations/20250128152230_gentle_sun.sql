-- Create SHEQ incidents table
CREATE TABLE IF NOT EXISTS sheq_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date timestamptz NOT NULL,
  location text NOT NULL,
  description text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  status text NOT NULL CHECK (status IN ('open', 'investigating', 'closed')) DEFAULT 'open',
  photos text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE sheq_incidents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all incidents"
  ON sheq_incidents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create incidents"
  ON sheq_incidents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update incidents"
  ON sheq_incidents FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_sheq_incidents_date ON sheq_incidents(date);
CREATE INDEX idx_sheq_incidents_severity ON sheq_incidents(severity);
CREATE INDEX idx_sheq_incidents_status ON sheq_incidents(status);

-- Create updated_at trigger
CREATE TRIGGER update_sheq_incidents_updated_at
  BEFORE UPDATE ON sheq_incidents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();