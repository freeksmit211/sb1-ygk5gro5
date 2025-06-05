-- Add driver_name column to forms_fuel table
ALTER TABLE forms_fuel
ADD COLUMN IF NOT EXISTS driver_name text;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_forms_fuel_driver_name ON forms_fuel(driver_name);

-- Update existing entries to have empty string instead of null
UPDATE forms_fuel 
SET driver_name = ''
WHERE driver_name IS NULL;

-- Add constraint to ensure driver_name is not null
ALTER TABLE forms_fuel 
ALTER COLUMN driver_name SET DEFAULT '',
ALTER COLUMN driver_name SET NOT NULL;