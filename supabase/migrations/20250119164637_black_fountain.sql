-- First add back the old columns if they don't exist
ALTER TABLE budgets 
ADD COLUMN IF NOT EXISTS franco_data jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS freek_data jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS jeckie_data jsonb DEFAULT '{}'::jsonb;

-- Migrate data from new columns to old columns
DO $$ 
BEGIN
  -- Create temporary table to store data if new columns exist
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'budgets' 
    AND column_name IN ('so1_data', 'so3_data', 'so5_data')
  ) THEN
    -- Create temp table
    CREATE TEMP TABLE temp_budget_data AS
    SELECT 
      id,
      year,
      COALESCE(so1_data, '{}'::jsonb) as so1_data,
      COALESCE(so3_data, '{}'::jsonb) as so3_data,
      COALESCE(so5_data, '{}'::jsonb) as so5_data
    FROM budgets;

    -- Update data in old columns
    UPDATE budgets b
    SET 
      franco_data = t.so1_data,
      freek_data = t.so3_data,
      jeckie_data = t.so5_data
    FROM temp_budget_data t
    WHERE b.id = t.id;

    -- Drop temp table
    DROP TABLE temp_budget_data;
  END IF;
END $$;

-- Drop new columns
ALTER TABLE budgets 
DROP COLUMN IF EXISTS so1_data,
DROP COLUMN IF EXISTS so3_data,
DROP COLUMN IF EXISTS so5_data;

-- Drop sales rep related tables
DROP TABLE IF EXISTS sales_rep_allocations;
DROP TABLE IF EXISTS sales_rep_mapping;
DROP TABLE IF EXISTS sales_rep_vehicle_allocations;

-- Remove sales_rep_code column from forms_fuel
ALTER TABLE forms_fuel DROP COLUMN IF EXISTS sales_rep_code;

-- Update sales_activities constraints
ALTER TABLE sales_activities DROP CONSTRAINT IF EXISTS valid_rep_id;
ALTER TABLE sales_activities ADD CONSTRAINT valid_rep_id 
  CHECK (rep_id IN ('franco', 'freek', 'jeckie', 'inHouse', 'cod'));

-- Update sales_feedback constraints
ALTER TABLE sales_feedback DROP CONSTRAINT IF EXISTS valid_rep_id;
ALTER TABLE sales_feedback ADD CONSTRAINT valid_rep_id 
  CHECK (rep_id IN ('franco', 'freek', 'jeckie', 'inHouse', 'cod'));