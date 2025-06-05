-- Create Freek activities table
CREATE TABLE IF NOT EXISTS freek_activities (
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

-- Create Freek feedback table
CREATE TABLE IF NOT EXISTS freek_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid REFERENCES freek_activities(id) ON DELETE CASCADE,
  note text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE freek_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE freek_feedback ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all Freek activities"
  ON freek_activities FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create Freek activities"
  ON freek_activities FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update Freek activities"
  ON freek_activities FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Users can view all Freek feedback"
  ON freek_feedback FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create Freek feedback"
  ON freek_feedback FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update Freek feedback"
  ON freek_feedback FOR UPDATE TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_freek_activities_date ON freek_activities(date);
CREATE INDEX idx_freek_feedback_activity_id ON freek_feedback(activity_id);

-- Create triggers for updated_at
CREATE TRIGGER update_freek_activities_updated_at
  BEFORE UPDATE ON freek_activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_freek_feedback_updated_at
  BEFORE UPDATE ON freek_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();