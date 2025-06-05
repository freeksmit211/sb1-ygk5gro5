-- First drop existing constraints
ALTER TABLE sales_rep_allocations 
DROP CONSTRAINT IF EXISTS sales_rep_allocations_code_check;

ALTER TABLE sales_rep_vehicle_allocations
DROP CONSTRAINT IF EXISTS sales_rep_vehicle_allocations_rep_code_check;

-- Add new constraints that allow any S0 followed by numbers
ALTER TABLE sales_rep_allocations 
ADD CONSTRAINT sales_rep_allocations_code_check 
CHECK (code ~ '^S0[0-9]+$');

ALTER TABLE sales_rep_vehicle_allocations
ADD CONSTRAINT sales_rep_vehicle_allocations_rep_code_check
CHECK (rep_code ~ '^S0[0-9]+$');

-- Create a function to add budget columns
CREATE OR REPLACE FUNCTION add_budget_columns() 
RETURNS void AS $$
DECLARE
  rep RECORD;
BEGIN
  FOR rep IN SELECT DISTINCT code, LOWER(name) as name_lower FROM sales_rep_allocations
  LOOP
    EXECUTE format(
      'ALTER TABLE budgets ADD COLUMN IF NOT EXISTS %I jsonb DEFAULT ''{}'';',
      LOWER(rep.code) || '_data'
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT add_budget_columns();

-- Drop the function since we don't need it anymore
DROP FUNCTION add_budget_columns();

-- Update existing data
UPDATE sales_rep_allocations
SET code = REPLACE(code, 'SO', 'S0')
WHERE code LIKE 'SO%';

UPDATE sales_rep_vehicle_allocations
SET rep_code = REPLACE(rep_code, 'SO', 'S0')
WHERE rep_code LIKE 'SO%';