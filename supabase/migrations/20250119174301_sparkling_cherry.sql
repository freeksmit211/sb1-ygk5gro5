-- Add sales_rep_code column to forms_fuel if it doesn't exist
ALTER TABLE forms_fuel
ADD COLUMN IF NOT EXISTS sales_rep_code text;

-- Update the check constraint to allow any valid sales rep code
ALTER TABLE forms_fuel
DROP CONSTRAINT IF EXISTS forms_fuel_sales_rep_code_check;

ALTER TABLE forms_fuel
ADD CONSTRAINT forms_fuel_sales_rep_code_check
CHECK (sales_rep_code ~ '^S0[0-9]+$');

-- Create a reference table for valid rep IDs
CREATE TABLE IF NOT EXISTS valid_rep_ids (
  rep_id text PRIMARY KEY,
  is_system boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Insert standard system rep IDs
INSERT INTO valid_rep_ids (rep_id, is_system)
VALUES 
  ('inHouse', true),
  ('cod', true)
ON CONFLICT (rep_id) DO NOTHING;

-- Create function to sync rep IDs from allocations
CREATE OR REPLACE FUNCTION sync_rep_ids()
RETURNS void AS $$
BEGIN
  -- Delete old non-system rep IDs
  DELETE FROM valid_rep_ids 
  WHERE NOT is_system;
  
  -- Insert new rep IDs from allocations
  INSERT INTO valid_rep_ids (rep_id, is_system)
  SELECT LOWER(name), false
  FROM sales_rep_allocations
  ON CONFLICT (rep_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function for rep changes
CREATE OR REPLACE FUNCTION on_sales_rep_change()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM sync_rep_ids();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS sales_rep_change_trigger ON sales_rep_allocations;
CREATE TRIGGER sales_rep_change_trigger
  AFTER INSERT OR UPDATE OR DELETE ON sales_rep_allocations
  FOR EACH STATEMENT
  EXECUTE FUNCTION on_sales_rep_change();

-- Initial sync of rep IDs
SELECT sync_rep_ids();

-- Update sales_activities constraints
ALTER TABLE sales_activities
DROP CONSTRAINT IF EXISTS valid_rep_id;

ALTER TABLE sales_activities
ADD CONSTRAINT valid_rep_id 
CHECK (rep_id = ANY(ARRAY['inHouse', 'cod', 'franco', 'freek', 'jeckie']));

-- Update sales_feedback constraints  
ALTER TABLE sales_feedback
DROP CONSTRAINT IF EXISTS valid_rep_id;

ALTER TABLE sales_feedback
ADD CONSTRAINT valid_rep_id 
CHECK (rep_id = ANY(ARRAY['inHouse', 'cod', 'franco', 'freek', 'jeckie']));

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION sync_rep_ids TO authenticated;