-- Add serial_number column to repairs table
ALTER TABLE repairs
ADD COLUMN serial_number text;

-- Update existing rows to have empty string instead of null
UPDATE repairs 
SET serial_number = ''
WHERE serial_number IS NULL;

-- Add not null constraint
ALTER TABLE repairs 
ALTER COLUMN serial_number SET NOT NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_repairs_serial_number ON repairs(serial_number);