-- First check if old columns exist and have data
DO $$ 
BEGIN
  -- Create temporary table to store data if old columns exist
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'budgets' 
    AND column_name IN ('franco_data', 'freek_data', 'jeckie_data')
  ) THEN
    -- Create temp table
    CREATE TEMP TABLE temp_budget_data AS
    SELECT 
      id,
      year,
      COALESCE(franco_data, '{}'::jsonb) as franco_data,
      COALESCE(freek_data, '{}'::jsonb) as freek_data,
      COALESCE(jeckie_data, '{}'::jsonb) as jeckie_data
    FROM budgets;

    -- Update data in new columns
    UPDATE budgets b
    SET 
      so1_data = t.franco_data,
      so3_data = t.freek_data,
      so5_data = t.jeckie_data
    FROM temp_budget_data t
    WHERE b.id = t.id;

    -- Drop temp table
    DROP TABLE temp_budget_data;
  END IF;
END $$;

-- Ensure all required columns exist with default values
UPDATE budgets
SET 
  so1_data = COALESCE(so1_data, '{}'::jsonb),
  so3_data = COALESCE(so3_data, '{}'::jsonb),
  so5_data = COALESCE(so5_data, '{}'::jsonb),
  in_house_data = COALESCE(in_house_data, '{}'::jsonb),
  cod_data = COALESCE(cod_data, '{}'::jsonb);

-- Drop old columns if they exist
ALTER TABLE budgets 
DROP COLUMN IF EXISTS franco_data,
DROP COLUMN IF EXISTS freek_data,
DROP COLUMN IF EXISTS jeckie_data;