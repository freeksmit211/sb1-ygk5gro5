-- First drop the existing trigger and function if they exist
DROP TRIGGER IF EXISTS ensure_budget_data_consistency_trigger ON budgets;
DROP FUNCTION IF EXISTS ensure_budget_data_consistency();

-- First ensure all required columns exist
ALTER TABLE budgets
ADD COLUMN IF NOT EXISTS franco_data jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS freek_data jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS jeckie_data jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS in_house_data jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS cod_data jsonb DEFAULT '{}'::jsonb;

-- Add constraints to ensure valid JSON
ALTER TABLE budgets
DROP CONSTRAINT IF EXISTS valid_franco_data,
DROP CONSTRAINT IF EXISTS valid_freek_data,
DROP CONSTRAINT IF EXISTS valid_jeckie_data,
DROP CONSTRAINT IF EXISTS valid_in_house_data,
DROP CONSTRAINT IF EXISTS valid_cod_data;

ALTER TABLE budgets
ADD CONSTRAINT valid_franco_data CHECK (jsonb_typeof(franco_data) = 'object'),
ADD CONSTRAINT valid_freek_data CHECK (jsonb_typeof(freek_data) = 'object'),
ADD CONSTRAINT valid_jeckie_data CHECK (jsonb_typeof(jeckie_data) = 'object'),
ADD CONSTRAINT valid_in_house_data CHECK (jsonb_typeof(in_house_data) = 'object'),
ADD CONSTRAINT valid_cod_data CHECK (jsonb_typeof(cod_data) = 'object');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_budgets_franco_data ON budgets USING gin (franco_data);
CREATE INDEX IF NOT EXISTS idx_budgets_freek_data ON budgets USING gin (freek_data);
CREATE INDEX IF NOT EXISTS idx_budgets_jeckie_data ON budgets USING gin (jeckie_data);
CREATE INDEX IF NOT EXISTS idx_budgets_in_house_data ON budgets USING gin (in_house_data);
CREATE INDEX IF NOT EXISTS idx_budgets_cod_data ON budgets USING gin (cod_data);

-- Create function to ensure data consistency
CREATE OR REPLACE FUNCTION ensure_budget_data_consistency()
RETURNS TRIGGER AS $$
BEGIN
  NEW.franco_data = COALESCE(NEW.franco_data, '{}'::jsonb);
  NEW.freek_data = COALESCE(NEW.freek_data, '{}'::jsonb);
  NEW.jeckie_data = COALESCE(NEW.jeckie_data, '{}'::jsonb);
  NEW.in_house_data = COALESCE(NEW.in_house_data, '{}'::jsonb);
  NEW.cod_data = COALESCE(NEW.cod_data, '{}'::jsonb);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER ensure_budget_data_consistency_trigger
  BEFORE INSERT OR UPDATE ON budgets
  FOR EACH ROW
  EXECUTE FUNCTION ensure_budget_data_consistency();

-- Insert initial data for current year if not exists
INSERT INTO budgets (
  year,
  franco_data,
  freek_data,
  jeckie_data,
  in_house_data,
  cod_data
)
VALUES (
  2025,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb
)
ON CONFLICT (year) DO NOTHING;