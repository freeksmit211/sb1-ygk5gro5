-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS ensure_budget_column_exists(text);
DROP FUNCTION IF EXISTS add_sales_rep_budget_column(text);
DROP FUNCTION IF EXISTS on_sales_rep_added();

-- Create function to ensure budget column exists
CREATE OR REPLACE FUNCTION ensure_budget_column_exists(p_column_name text)
RETURNS void AS $$
BEGIN
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
$$ LANGUAGE plpgsql;

-- Create function to add budget column for a sales rep
CREATE OR REPLACE FUNCTION add_sales_rep_budget_column(p_code text)
RETURNS void AS $$
DECLARE
  column_name text;
BEGIN
  -- Convert code to lowercase and append _data
  column_name := LOWER(p_code) || '_data';
  PERFORM ensure_budget_column_exists(column_name);
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to automatically add budget column when new rep is added
CREATE OR REPLACE FUNCTION on_sales_rep_added()
RETURNS TRIGGER AS $$
BEGIN
  -- Add budget column for new rep
  PERFORM add_sales_rep_budget_column(NEW.code);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS sales_rep_added_trigger ON sales_rep_allocations;
CREATE TRIGGER sales_rep_added_trigger
  AFTER INSERT ON sales_rep_allocations
  FOR EACH ROW
  EXECUTE FUNCTION on_sales_rep_added();

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION ensure_budget_column_exists TO authenticated;
GRANT EXECUTE ON FUNCTION add_sales_rep_budget_column TO authenticated;

-- Add budget columns for existing reps
DO $$
DECLARE
  rep_code text;
BEGIN
  FOR rep_code IN SELECT code FROM sales_rep_allocations
  LOOP
    PERFORM add_sales_rep_budget_column(rep_code);
  END LOOP;
END $$;