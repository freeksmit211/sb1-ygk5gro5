-- Drop existing function if it exists
DROP FUNCTION IF EXISTS ensure_budget_column_exists(text);
DROP FUNCTION IF EXISTS ensure_budget_column_exists(p_column_name text);

-- Create improved function with proper parameter naming and error handling
CREATE OR REPLACE FUNCTION ensure_budget_column_exists(p_column_name text)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  -- Validate input
  IF p_column_name IS NULL OR p_column_name = '' THEN
    RAISE EXCEPTION 'Column name cannot be null or empty';
  END IF;

  -- Check if column exists
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'budgets' 
    AND column_name = p_column_name
  ) THEN
    -- Add column if it doesn't exist
    EXECUTE format(
      'ALTER TABLE budgets ADD COLUMN IF NOT EXISTS %I jsonb DEFAULT ''{}'';',
      p_column_name
    );
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION ensure_budget_column_exists(text) TO authenticated;

-- Create index for the column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'budgets' 
    AND indexname = 'idx_budgets_year'
  ) THEN
    CREATE INDEX idx_budgets_year ON budgets(year);
  END IF;
END $$;