-- Add time column to sales_activities table
ALTER TABLE sales_activities
ADD COLUMN IF NOT EXISTS time text;

-- Create index for time column
CREATE INDEX IF NOT EXISTS idx_sales_activities_time ON sales_activities(time);

-- Update existing activities to have a default time
UPDATE sales_activities 
SET time = '09:00'
WHERE time IS NULL;