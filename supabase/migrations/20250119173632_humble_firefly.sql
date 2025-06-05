-- Create function to ensure budget column exists
CREATE OR REPLACE FUNCTION ensure_budget_column_exists(column_name text)
RETURNS void AS $$
BEGIN
  -- Check if column exists
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'budgets' 
    AND column_name = column_name
  ) THEN
    -- Add column if it doesn't exist
    EXECUTE format(
      'ALTER TABLE budgets ADD COLUMN %I jsonb DEFAULT ''{}'';',
      column_name
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION ensure_budget_column_exists TO authenticated;