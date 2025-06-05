-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can view all sales activities" ON sales_activities;
DROP POLICY IF EXISTS "Users can create sales activities" ON sales_activities;
DROP POLICY IF EXISTS "Users can update sales activities" ON sales_activities;

-- Create new RLS policies with proper authentication checks
CREATE POLICY "Enable read access for authenticated users"
  ON sales_activities
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON sales_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON sales_activities
  FOR UPDATE
  TO authenticated
  USING (true);

-- Drop existing RLS policies for feedback
DROP POLICY IF EXISTS "Users can view all feedback" ON sales_feedback;
DROP POLICY IF EXISTS "Users can create feedback" ON sales_feedback;
DROP POLICY IF EXISTS "Users can update feedback" ON sales_feedback;

-- Create new RLS policies for feedback
CREATE POLICY "Enable read access for authenticated users"
  ON sales_feedback
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON sales_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON sales_feedback
  FOR UPDATE
  TO authenticated
  USING (true);

-- Ensure RLS is enabled
ALTER TABLE sales_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_feedback ENABLE ROW LEVEL SECURITY;

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_sales_activities_rep_id ON sales_activities(rep_id);
CREATE INDEX IF NOT EXISTS idx_sales_activities_date ON sales_activities(date);
CREATE INDEX IF NOT EXISTS idx_sales_feedback_activity_id ON sales_feedback(activity_id);
CREATE INDEX IF NOT EXISTS idx_sales_feedback_rep_id ON sales_feedback(rep_id);