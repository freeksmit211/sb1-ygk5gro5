-- Add tasks_completed column to maintenance_schedules table
ALTER TABLE maintenance_schedules
ADD COLUMN IF NOT EXISTS tasks_completed text[] DEFAULT '{}';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_maintenance_schedules_tasks_completed 
ON maintenance_schedules USING gin (tasks_completed);

-- Update existing rows to have empty array if null
UPDATE maintenance_schedules 
SET tasks_completed = '{}'
WHERE tasks_completed IS NULL;

-- Add constraint to ensure tasks_completed is not null
ALTER TABLE maintenance_schedules 
ALTER COLUMN tasks_completed SET NOT NULL,
ALTER COLUMN tasks_completed SET DEFAULT '{}';