-- Add time column to sales_activities table
ALTER TABLE sales_activities
ADD COLUMN IF NOT EXISTS time text DEFAULT '09:00';

-- Create index for time column
CREATE INDEX IF NOT EXISTS idx_sales_activities_time ON sales_activities(time);

-- Update existing activities to have a default time
UPDATE sales_activities 
SET time = '09:00'
WHERE time IS NULL;

-- Add constraint to ensure time is in valid format
ALTER TABLE sales_activities
ADD CONSTRAINT valid_time_format 
CHECK (time ~ '^([0-1][0-9]|2[0-3]):[0-5][0-9]$');