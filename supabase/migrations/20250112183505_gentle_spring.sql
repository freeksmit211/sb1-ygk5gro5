-- Add explicit foreign key constraint for sales_feedback to sales_activities
ALTER TABLE sales_feedback
DROP CONSTRAINT IF EXISTS sales_feedback_activity_id_fkey,
ADD CONSTRAINT sales_feedback_activity_id_fkey 
  FOREIGN KEY (activity_id) 
  REFERENCES sales_activities(id) 
  ON DELETE CASCADE;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sales_feedback_activity_id ON sales_feedback(activity_id);
CREATE INDEX IF NOT EXISTS idx_sales_feedback_rep_id ON sales_feedback(rep_id);