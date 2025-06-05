-- First drop existing constraints if they exist
DO $$ BEGIN
  ALTER TABLE budgets DROP CONSTRAINT IF EXISTS valid_franco_data;
  ALTER TABLE budgets DROP CONSTRAINT IF EXISTS valid_freek_data;
  ALTER TABLE budgets DROP CONSTRAINT IF EXISTS valid_jeckie_data;
  ALTER TABLE budgets DROP CONSTRAINT IF EXISTS valid_in_house_data;
  ALTER TABLE budgets DROP CONSTRAINT IF EXISTS valid_cod_data;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Rename columns safely
DO $$ BEGIN
  -- Only rename if the old column exists and new doesn't
  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'budgets' 
    AND column_name = 'franco_data'
  ) AND NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'budgets' 
    AND column_name = 'so1_data'
  ) THEN
    ALTER TABLE budgets RENAME COLUMN franco_data TO so1_data;
  END IF;

  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'budgets' 
    AND column_name = 'freek_data'
  ) AND NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'budgets' 
    AND column_name = 'so3_data'
  ) THEN
    ALTER TABLE budgets RENAME COLUMN freek_data TO so3_data;
  END IF;

  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'budgets' 
    AND column_name = 'jeckie_data'
  ) AND NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'budgets' 
    AND column_name = 'so5_data'
  ) THEN
    ALTER TABLE budgets RENAME COLUMN jeckie_data TO so5_data;
  END IF;
END $$;

-- Add new constraints
ALTER TABLE budgets
  ADD CONSTRAINT valid_so1_data CHECK (jsonb_typeof(so1_data) = 'object'),
  ADD CONSTRAINT valid_so3_data CHECK (jsonb_typeof(so3_data) = 'object'),
  ADD CONSTRAINT valid_so5_data CHECK (jsonb_typeof(so5_data) = 'object');

-- Ensure index exists
CREATE INDEX IF NOT EXISTS idx_budgets_year ON budgets(year);