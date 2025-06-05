-- Create Franco activities table
CREATE TABLE IF NOT EXISTS franco_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date timestamptz NOT NULL,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('meeting', 'call', 'quote', 'order', 'delivery')),
  customer_name text NOT NULL,
  company text NOT NULL,
  status text NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create Franco feedback table
CREATE TABLE IF NOT EXISTS franco_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid REFERENCES franco_activities(id) ON DELETE CASCADE,
  note text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create Jeckie activities table
CREATE TABLE IF NOT EXISTS jeckie_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date timestamptz NOT NULL,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('meeting', 'call', 'quote', 'order', 'delivery')),
  customer_name text NOT NULL,
  company text NOT NULL,
  status text NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create Jeckie feedback table
CREATE TABLE IF NOT EXISTS jeckie_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid REFERENCES jeckie_activities(id) ON DELETE CASCADE,
  note text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE franco_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE franco_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE jeckie_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE jeckie_feedback ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all Franco activities"
  ON franco_activities FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create Franco activities"
  ON franco_activities FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update Franco activities"
  ON franco_activities FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Users can view all Franco feedback"
  ON franco_feedback FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create Franco feedback"
  ON franco_feedback FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update Franco feedback"
  ON franco_feedback FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Users can view all Jeckie activities"
  ON jeckie_activities FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create Jeckie activities"
  ON jeckie_activities FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update Jeckie activities"
  ON jeckie_activities FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Users can view all Jeckie feedback"
  ON jeckie_feedback FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create Jeckie feedback"
  ON jeckie_feedback FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update Jeckie feedback"
  ON jeckie_feedback FOR UPDATE TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_franco_activities_date ON franco_activities(date);
CREATE INDEX idx_franco_feedback_activity_id ON franco_feedback(activity_id);
CREATE INDEX idx_jeckie_activities_date ON jeckie_activities(date);
CREATE INDEX idx_jeckie_feedback_activity_id ON jeckie_feedback(activity_id);

-- Create triggers for updated_at
CREATE TRIGGER update_franco_activities_updated_at
  BEFORE UPDATE ON franco_activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_franco_feedback_updated_at
  BEFORE UPDATE ON franco_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jeckie_activities_updated_at
  BEFORE UPDATE ON jeckie_activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jeckie_feedback_updated_at
  BEFORE UPDATE ON jeckie_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();