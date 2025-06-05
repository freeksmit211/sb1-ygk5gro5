-- Drop existing contacts table if it exists
DROP TABLE IF EXISTS contacts;

-- Create contacts table with required fields
CREATE TABLE contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text NOT NULL,
  department text NOT NULL DEFAULT '',
  email text NOT NULL,
  landline text,
  cell text NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add email validation (more lenient)
ALTER TABLE contacts 
  ADD CONSTRAINT valid_email 
  CHECK (email ~ '^[A-Za-z0-9._%+-@]+$');

-- Add basic phone number validation (very lenient)
ALTER TABLE contacts
  ADD CONSTRAINT valid_cell
  CHECK (length(regexp_replace(cell, '[^0-9]', '', 'g')) >= 10);

ALTER TABLE contacts
  ADD CONSTRAINT valid_landline
  CHECK (landline IS NULL OR landline = '' OR length(regexp_replace(landline, '[^0-9]', '', 'g')) >= 10);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all contacts"
  ON contacts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create contacts"
  ON contacts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update contacts"
  ON contacts FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_contacts_name ON contacts(name);
CREATE INDEX idx_contacts_company ON contacts(company);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_status ON contacts(status);

-- Create updated_at trigger
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();