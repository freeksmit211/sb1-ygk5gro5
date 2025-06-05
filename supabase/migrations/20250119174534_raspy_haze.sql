-- Add sales_rep_code column to forms_fuel if it doesn't exist
ALTER TABLE forms_fuel
ADD COLUMN IF NOT EXISTS sales_rep_code text;

-- Update the check constraint to allow any valid sales rep code
ALTER TABLE forms_fuel
DROP CONSTRAINT IF EXISTS forms_fuel_sales_rep_code_check;

ALTER TABLE forms_fuel
ADD CONSTRAINT forms_fuel_sales_rep_code_check
CHECK (sales_rep_code ~ '^S0[0-9]+$');

-- Create an enum type for rep IDs
CREATE TYPE rep_id_type AS ENUM ('franco', 'freek', 'jeckie', 'inHouse', 'cod');

-- Update sales_activities constraints
ALTER TABLE sales_activities
DROP CONSTRAINT IF EXISTS valid_rep_id;

ALTER TABLE sales_activities
ALTER COLUMN rep_id TYPE rep_id_type 
  USING rep_id::rep_id_type;

-- Update sales_feedback constraints
ALTER TABLE sales_feedback
DROP CONSTRAINT IF EXISTS valid_rep_id;

ALTER TABLE sales_feedback
ALTER COLUMN rep_id TYPE rep_id_type 
  USING rep_id::rep_id_type;

-- Create function to refresh rep constraints
CREATE OR REPLACE FUNCTION refresh_rep_constraints()
RETURNS void AS $$
BEGIN
  -- This function is kept for future use but doesn't need to do anything
  -- since we're using an enum type now
  NULL;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION refresh_rep_constraints TO authenticated;