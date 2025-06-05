-- Create function to handle activity deletion with feedback
CREATE OR REPLACE FUNCTION delete_activity_with_feedback(activity_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete feedback first
  DELETE FROM sales_feedback
  WHERE activity_id = $1;

  -- Then delete the activity
  DELETE FROM sales_activities
  WHERE id = $1;

  -- Return true if successful
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_activity_with_feedback TO authenticated;

-- Add cascade delete to feedback
ALTER TABLE sales_feedback
DROP CONSTRAINT IF EXISTS sales_feedback_activity_id_fkey,
ADD CONSTRAINT sales_feedback_activity_id_fkey 
  FOREIGN KEY (activity_id) 
  REFERENCES sales_activities(id) 
  ON DELETE CASCADE;

-- Create trigger function to handle cleanup
CREATE OR REPLACE FUNCTION handle_activity_cleanup()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete any related feedback
  DELETE FROM sales_feedback WHERE activity_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS activity_cleanup_trigger ON sales_activities;
CREATE TRIGGER activity_cleanup_trigger
  BEFORE DELETE ON sales_activities
  FOR EACH ROW
  EXECUTE FUNCTION handle_activity_cleanup();