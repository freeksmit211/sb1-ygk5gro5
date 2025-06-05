-- First ensure we have the correct columns
ALTER TABLE budgets
ADD COLUMN IF NOT EXISTS franco_data jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS freek_data jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS jeckie_data jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS in_house_data jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS cod_data jsonb DEFAULT '{}'::jsonb;

-- Insert or update the 2024/2025 financial year
INSERT INTO budgets (
  year,
  franco_data,
  freek_data,
  jeckie_data,
  in_house_data,
  cod_data
)
VALUES (
  2024,
  jsonb_build_object(
    'March', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'April', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'May', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'June', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'July', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'August', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'September', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'October', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'November', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'December', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'January', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'February', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0)
  ),
  jsonb_build_object(
    'March', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'April', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'May', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'June', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'July', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'August', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'September', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'October', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'November', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'December', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'January', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'February', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0)
  ),
  jsonb_build_object(
    'March', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'April', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'May', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'June', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'July', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'August', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'September', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'October', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'November', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'December', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'January', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'February', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0)
  ),
  jsonb_build_object(
    'March', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'April', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'May', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'June', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'July', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'August', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'September', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'October', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'November', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'December', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'January', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'February', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0)
  ),
  jsonb_build_object(
    'March', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'April', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'May', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'June', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'July', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'August', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'September', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'October', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'November', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'December', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'January', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0),
    'February', jsonb_build_object('target', 0, 'invoiceValue', 0, 'orderValue', 0)
  )
)
ON CONFLICT (year) DO UPDATE
SET
  franco_data = EXCLUDED.franco_data,
  freek_data = EXCLUDED.freek_data,
  jeckie_data = EXCLUDED.jeckie_data,
  in_house_data = EXCLUDED.in_house_data,
  cod_data = EXCLUDED.cod_data;

-- Also ensure we have the Simotech yearly budget
INSERT INTO simotech_budgets (
  year,
  budget
)
VALUES (
  2024,
  jsonb_build_object(
    'target', 0,
    'invoiceValue', 0,
    'orderValue', 0
  )
)
ON CONFLICT (year) DO UPDATE
SET budget = EXCLUDED.budget;