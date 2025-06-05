-- Add delete policy to sales_rep_allocations
DROP POLICY IF EXISTS "Users can delete sales rep allocations" ON sales_rep_allocations;

CREATE POLICY "Users can delete sales rep allocations"
  ON sales_rep_allocations FOR DELETE
  TO authenticated
  USING (true);

-- Create function to handle cleanup when a sales rep is deleted
CREATE OR REPLACE FUNCTION handle_sales_rep_deletion()
RETURNS TRIGGER AS $$
BEGIN
  -- End any active vehicle allocations
  UPDATE sales_rep_vehicle_allocations
  SET end_date = now()
  WHERE rep_code = OLD.code
  AND end_date IS NULL;

  -- Drop the budget column for this rep
  EXECUTE format(
    'ALTER TABLE budgets DROP COLUMN IF EXISTS %I',
    LOWER(OLD.code) || '_data'
  );

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for cleanup
DROP TRIGGER IF EXISTS sales_rep_deletion_trigger ON sales_rep_allocations;
CREATE TRIGGER sales_rep_deletion_trigger
  BEFORE DELETE ON sales_rep_allocations
  FOR EACH ROW
  EXECUTE FUNCTION handle_sales_rep_deletion();