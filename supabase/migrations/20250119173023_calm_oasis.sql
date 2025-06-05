-- First drop existing constraints
ALTER TABLE sales_rep_allocations 
DROP CONSTRAINT IF EXISTS sales_rep_allocations_code_check;

ALTER TABLE sales_rep_vehicle_allocations
DROP CONSTRAINT IF EXISTS sales_rep_vehicle_allocations_rep_code_check;

-- Add temporary less restrictive constraints
ALTER TABLE sales_rep_allocations 
ADD CONSTRAINT temp_sales_rep_allocations_code_check 
CHECK (code ~ '^S[O0][0-9]+$');

ALTER TABLE sales_rep_vehicle_allocations
ADD CONSTRAINT temp_sales_rep_vehicle_allocations_rep_code_check
CHECK (rep_code ~ '^S[O0][0-9]+$');

-- Update existing data
UPDATE sales_rep_allocations
SET code = REPLACE(code, 'SO', 'S0')
WHERE code LIKE 'SO%';

UPDATE sales_rep_vehicle_allocations
SET rep_code = REPLACE(rep_code, 'SO', 'S0')
WHERE rep_code LIKE 'SO%';

-- Drop temporary constraints
ALTER TABLE sales_rep_allocations 
DROP CONSTRAINT IF EXISTS temp_sales_rep_allocations_code_check;

ALTER TABLE sales_rep_vehicle_allocations
DROP CONSTRAINT IF EXISTS temp_sales_rep_vehicle_allocations_rep_code_check;

-- Add final constraints
ALTER TABLE sales_rep_allocations 
ADD CONSTRAINT sales_rep_allocations_code_check 
CHECK (code ~ '^S0[0-9]+$');

ALTER TABLE sales_rep_vehicle_allocations
ADD CONSTRAINT sales_rep_vehicle_allocations_rep_code_check
CHECK (rep_code ~ '^S0[0-9]+$');

-- Update initial data if needed
UPDATE sales_rep_allocations 
SET code = 'S01'
WHERE code = 'SO1';

UPDATE sales_rep_allocations 
SET code = 'S03'
WHERE code = 'SO3';

UPDATE sales_rep_allocations 
SET code = 'S05'
WHERE code = 'SO5';