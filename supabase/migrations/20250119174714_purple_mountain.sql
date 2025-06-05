-- First drop existing trigger and function
DROP TRIGGER IF EXISTS sales_rep_deletion_trigger ON sales_rep_allocations;
DROP FUNCTION IF EXISTS handle_sales_rep_deletion();

-- Create function with SECURITY DEFINER to run with elevated privileges
CREATE OR REPLACE FUNCTION handle_sales_rep_deletion()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  -- End any active vehicle allocations
  UPDATE sales_rep_vehicle_allocations
  SET end_date = now()
  WHERE rep_code = OLD.code
  AND end_date IS NULL;

  -- Drop the budget column for this rep
  EXECUTE format(
    'ALTER TABLE budgets DROP COLUMN IF EXISTS %I CASCADE',
    LOWER(OLD.code) || '_data'
  );

  RETURN OLD;
END;
$$;

-- Recreate trigger
CREATE TRIGGER sales_rep_deletion_trigger
  BEFORE DELETE ON sales_rep_allocations
  FOR EACH ROW
  EXECUTE FUNCTION handle_sales_rep_deletion();

-- Ensure delete policy exists
DROP POLICY IF EXISTS "Users can delete sales rep allocations" ON sales_rep_allocations;

CREATE POLICY "Users can delete sales rep allocations"
  ON sales_rep_allocations FOR DELETE
  TO authenticated
  USING (true);

-- Grant necessary permissions
GRANT DELETE ON sales_rep_allocations TO authenticated;