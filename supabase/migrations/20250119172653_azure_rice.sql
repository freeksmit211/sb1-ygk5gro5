-- First, drop the existing check constraints
ALTER TABLE sales_rep_allocations 
DROP CONSTRAINT IF EXISTS sales_rep_allocations_code_check;

-- Create a new pattern-based check constraint
ALTER TABLE sales_rep_allocations 
ADD CONSTRAINT sales_rep_allocations_code_check 
CHECK (code ~ '^SO[0-9]+$');

-- Update vehicle allocations table constraint
ALTER TABLE sales_rep_vehicle_allocations
DROP CONSTRAINT IF EXISTS sales_rep_vehicle_allocations_rep_code_check;

ALTER TABLE sales_rep_vehicle_allocations
ADD CONSTRAINT sales_rep_vehicle_allocations_rep_code_check
CHECK (rep_code ~ '^SO[0-9]+$');