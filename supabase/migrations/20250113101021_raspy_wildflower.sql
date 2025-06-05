-- Create mapping table for sales rep codes
CREATE TABLE IF NOT EXISTS sales_rep_mapping (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL CHECK (code IN ('SO1', 'SO3', 'SO5')),
  current_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add unique constraint with a different name
ALTER TABLE sales_rep_mapping
ADD CONSTRAINT sales_rep_mapping_code_key UNIQUE (code);

-- Enable RLS
ALTER TABLE sales_rep_mapping ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all sales rep mappings"
  ON sales_rep_mapping FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update sales rep mappings"
  ON sales_rep_mapping FOR UPDATE
  TO authenticated
  USING (true);

-- Update sales_activities to use rep codes
ALTER TABLE sales_activities 
ADD COLUMN IF NOT EXISTS rep_code text CHECK (rep_code IN ('SO1', 'SO3', 'SO5'));

-- Update sales_feedback to use rep codes
ALTER TABLE sales_feedback
ADD COLUMN IF NOT EXISTS rep_code text CHECK (rep_code IN ('SO1', 'SO3', 'SO5'));

-- Create function to map rep names to codes
CREATE OR REPLACE FUNCTION get_rep_code(rep_name text)
RETURNS text AS $$
BEGIN
  CASE lower(rep_name)
    WHEN 'franco' THEN RETURN 'SO1';
    WHEN 'freek' THEN RETURN 'SO3';
    WHEN 'jeckie' THEN RETURN 'SO5';
    ELSE RETURN NULL;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Migrate existing data
UPDATE sales_activities
SET rep_code = get_rep_code(rep_id)
WHERE rep_code IS NULL AND rep_id IN ('franco', 'freek', 'jeckie');

UPDATE sales_feedback
SET rep_code = get_rep_code(rep_id)
WHERE rep_code IS NULL AND rep_id IN ('franco', 'freek', 'jeckie');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sales_activities_rep_code ON sales_activities(rep_code);
CREATE INDEX IF NOT EXISTS idx_sales_feedback_rep_code ON sales_feedback(rep_code);

-- Insert initial mappings
INSERT INTO sales_rep_mapping (code, current_name)
VALUES 
  ('SO1', 'Franco'),
  ('SO3', 'Freek'),
  ('SO5', 'Jeckie')
ON CONFLICT (code) DO UPDATE
SET current_name = EXCLUDED.current_name;