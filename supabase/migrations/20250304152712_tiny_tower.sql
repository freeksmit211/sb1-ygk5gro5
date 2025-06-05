-- First update all statuses to 'new' to avoid constraint violation
ALTER TABLE repairs
ALTER COLUMN status TYPE text;

-- Drop the existing status check constraint
ALTER TABLE repairs
DROP CONSTRAINT IF EXISTS repairs_status_check;

-- Update existing statuses to their new values
UPDATE repairs
SET status = CASE status
  WHEN 'pending' THEN 'new'
  WHEN 'in-progress' THEN 'at-repair-centre'
  WHEN 'awaiting-parts' THEN 'awaiting-po'
  WHEN 'delivered' THEN 'completed'
  WHEN 'complete' THEN 'completed'
  ELSE 'new'
END;

-- Add the new status check constraint
ALTER TABLE repairs
ADD CONSTRAINT repairs_status_check
CHECK (status IN ('new', 'awaiting-po', 'at-repair-centre', 'repaired', 'scrapped', 'completed'));

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_repairs_status ON repairs(status);