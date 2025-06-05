/*
  # Budget Tables Migration

  1. New Tables
    - budgets: Stores yearly budgets for each account
    - simotech_budgets: Stores Simotech yearly budgets
  
  2. Structure
    - Each budget has monthly data stored in JSONB columns
    - Includes RLS policies and indexes
*/

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL UNIQUE,
  franco_data jsonb DEFAULT '{}'::jsonb,
  freek_data jsonb DEFAULT '{}'::jsonb,
  jeckie_data jsonb DEFAULT '{}'::jsonb,
  in_house_data jsonb DEFAULT '{}'::jsonb,
  cod_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Add constraints
  CONSTRAINT valid_year CHECK (year >= 2020 AND year <= 2100),
  CONSTRAINT valid_franco_data CHECK (jsonb_typeof(franco_data) = 'object'),
  CONSTRAINT valid_freek_data CHECK (jsonb_typeof(freek_data) = 'object'),
  CONSTRAINT valid_jeckie_data CHECK (jsonb_typeof(jeckie_data) = 'object'),
  CONSTRAINT valid_in_house_data CHECK (jsonb_typeof(in_house_data) = 'object'),
  CONSTRAINT valid_cod_data CHECK (jsonb_typeof(cod_data) = 'object')
);

-- Create simotech_budgets table
CREATE TABLE IF NOT EXISTS simotech_budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL UNIQUE,
  budget jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Add constraints
  CONSTRAINT valid_year CHECK (year >= 2020 AND year <= 2100),
  CONSTRAINT valid_budget CHECK (jsonb_typeof(budget) = 'object')
);

-- Enable RLS
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE simotech_budgets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all budgets"
  ON budgets FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can update budgets"
  ON budgets FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Users can insert budgets"
  ON budgets FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view all simotech budgets"
  ON simotech_budgets FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can update simotech budgets"
  ON simotech_budgets FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Users can insert simotech budgets"
  ON simotech_budgets FOR INSERT TO authenticated
  WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_budgets_year ON budgets(year);
CREATE INDEX idx_simotech_budgets_year ON simotech_budgets(year);

-- Create updated_at triggers
CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON budgets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_simotech_budgets_updated_at
  BEFORE UPDATE ON simotech_budgets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data for current year
INSERT INTO budgets (year)
VALUES (2025)
ON CONFLICT (year) DO NOTHING;

INSERT INTO simotech_budgets (year, budget)
VALUES (2025, '{"target": 0, "invoiceValue": 0, "orderValue": 0}'::jsonb)
ON CONFLICT (year) DO NOTHING;