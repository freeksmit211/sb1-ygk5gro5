-- Add cascade delete to sales_feedback when activity is deleted
ALTER TABLE sales_feedback
DROP CONSTRAINT IF EXISTS sales_feedback_activity_id_fkey,
ADD CONSTRAINT sales_feedback_activity_id_fkey 
  FOREIGN KEY (activity_id) 
  REFERENCES sales_activities(id) 
  ON DELETE CASCADE;

-- Create function to handle activity deletion
CREATE OR REPLACE FUNCTION handle_activity_deletion()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete related feedback
  DELETE FROM sales_feedback WHERE activity_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for activity deletion
DROP TRIGGER IF EXISTS activity_deletion_trigger ON sales_activities;
CREATE TRIGGER activity_deletion_trigger
  BEFORE DELETE ON sales_activities
  FOR EACH ROW
  EXECUTE FUNCTION handle_activity_deletion();