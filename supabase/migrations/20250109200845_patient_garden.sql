-- Create company contacts table
CREATE TABLE IF NOT EXISTS sheq_company_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES sheq_companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  role text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE sheq_company_contacts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all company contacts"
  ON sheq_company_contacts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create company contacts"
  ON sheq_company_contacts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update company contacts"
  ON sheq_company_contacts FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_company_contacts_company_id ON sheq_company_contacts(company_id);

-- Create updated_at trigger
CREATE TRIGGER update_company_contacts_updated_at
  BEFORE UPDATE ON sheq_company_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();