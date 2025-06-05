-- First drop the existing constraint if it exists
ALTER TABLE sales_activities 
DROP CONSTRAINT IF EXISTS valid_time_format;

-- Add time column if it doesn't exist
ALTER TABLE sales_activities
ADD COLUMN IF NOT EXISTS time text;

-- Create index for time column if it doesn't exist
DROP INDEX IF EXISTS idx_sales_activities_time;
CREATE INDEX idx_sales_activities_time ON sales_activities(time);

-- Update existing activities to have a default time
UPDATE sales_activities 
SET time = '09:00'
WHERE time IS NULL;

-- Add new constraint to ensure time is in valid format or null
ALTER TABLE sales_activities
ADD CONSTRAINT valid_time_format 
CHECK (time IS NULL OR time ~ '^([0-1][0-9]|2[0-3]):[0-5][0-9]$');