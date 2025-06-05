/*
  # Fix Contacts Table Constraints

  1. Updates
    - Add proper constraints for contacts table
    - Add validation for required fields
    - Add proper status handling
*/

-- First drop existing status check constraint if it exists
ALTER TABLE contacts DROP CONSTRAINT IF EXISTS contacts_status_check;

-- Update status column to use text with specific values
ALTER TABLE contacts 
  ALTER COLUMN status SET DEFAULT 'active',
  ADD CONSTRAINT contacts_status_check CHECK (status IN ('active', 'inactive'));

-- Set NOT NULL constraints
ALTER TABLE contacts 
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN company SET NOT NULL,
  ALTER COLUMN department SET NOT NULL,
  ALTER COLUMN email SET NOT NULL,
  ALTER COLUMN cell SET NOT NULL,
  ALTER COLUMN status SET NOT NULL;

-- Add email format check
ALTER TABLE contacts
  ADD CONSTRAINT valid_email 
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add phone number format checks (optional)
ALTER TABLE contacts
  ADD CONSTRAINT valid_cell
  CHECK (cell ~* '^\+?[0-9\s-()]{10,}$');

ALTER TABLE contacts
  ADD CONSTRAINT valid_landline
  CHECK (landline IS NULL OR landline = '' OR landline ~* '^\+?[0-9\s-()]{10,}$');

-- Create index for common queries
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company);