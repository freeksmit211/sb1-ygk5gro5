-- First add new columns if they don't exist
ALTER TABLE budgets 
ADD COLUMN IF NOT EXISTS so1_data jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS so3_data jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS so5_data jsonb DEFAULT '{}'::jsonb;

-- Create function to ensure data consistency
CREATE OR REPLACE FUNCTION ensure_budget_data_consistency()
RETURNS TRIGGER AS $$
BEGIN
  NEW.so1_data = COALESCE(NEW.so1_data, '{}'::jsonb);
  NEW.so3_data = COALESCE(NEW.so3_data, '{}'::jsonb);
  NEW.so5_data = COALESCE(NEW.so5_data, '{}'::jsonb);
  NEW.in_house_data = COALESCE(NEW.in_house_data, '{}'::jsonb);
  NEW.cod_data = COALESCE(NEW.cod_data, '{}'::jsonb);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS ensure_budget_data_consistency_trigger ON budgets;

-- Create new trigger
CREATE TRIGGER ensure_budget_data_consistency_trigger
  BEFORE INSERT OR UPDATE ON budgets
  FOR EACH ROW
  EXECUTE FUNCTION ensure_budget_data_consistency();

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_budgets_so1_data ON budgets USING gin (so1_data);
CREATE INDEX IF NOT EXISTS idx_budgets_so3_data ON budgets USING gin (so3_data);
CREATE INDEX IF NOT EXISTS idx_budgets_so5_data ON budgets USING gin (so5_data);

-- Insert initial data for current year if not exists
INSERT INTO budgets (year, so1_data, so3_data, so5_data, in_house_data, cod_data)
VALUES (
  2025,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb
)
ON CONFLICT (year) DO NOTHING;