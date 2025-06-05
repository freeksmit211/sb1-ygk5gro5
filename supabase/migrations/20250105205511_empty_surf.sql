-- Drop existing tables if they exist
DROP TABLE IF EXISTS sheq_personnel_documents;
DROP TABLE IF EXISTS sheq_personnel;
DROP TABLE IF EXISTS sheq_documents;
DROP TABLE IF EXISTS sheq_companies;

-- Create SHEQ companies table
CREATE TABLE sheq_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact_person text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create SHEQ documents table
CREATE TABLE sheq_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES sheq_companies(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL CHECK (file_type IN ('safetyFile', 'medicals', 'inductions')),
  expiry_date timestamptz NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create SHEQ personnel table
CREATE TABLE sheq_personnel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES sheq_companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  id_number text NOT NULL,
  position text NOT NULL,
  contact_number text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create SHEQ personnel documents table
CREATE TABLE sheq_personnel_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  personnel_id uuid REFERENCES sheq_personnel(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL CHECK (file_type IN ('medicals', 'inductions')),
  expiry_date timestamptz NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE sheq_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE sheq_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE sheq_personnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE sheq_personnel_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all SHEQ companies"
  ON sheq_companies FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create SHEQ companies"
  ON sheq_companies FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update SHEQ companies"
  ON sheq_companies FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Users can view all SHEQ documents"
  ON sheq_documents FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create SHEQ documents"
  ON sheq_documents FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update SHEQ documents"
  ON sheq_documents FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Users can view all SHEQ personnel"
  ON sheq_personnel FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create SHEQ personnel"
  ON sheq_personnel FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update SHEQ personnel"
  ON sheq_personnel FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Users can view all SHEQ personnel documents"
  ON sheq_personnel_documents FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create SHEQ personnel documents"
  ON sheq_personnel_documents FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update SHEQ personnel documents"
  ON sheq_personnel_documents FOR UPDATE TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_sheq_documents_company_id ON sheq_documents(company_id);
CREATE INDEX idx_sheq_documents_file_type ON sheq_documents(file_type);
CREATE INDEX idx_sheq_documents_expiry_date ON sheq_documents(expiry_date);
CREATE INDEX idx_sheq_personnel_company_id ON sheq_personnel(company_id);
CREATE INDEX idx_sheq_personnel_documents_personnel_id ON sheq_personnel_documents(personnel_id);

-- Create updated_at triggers
CREATE TRIGGER update_sheq_companies_updated_at
  BEFORE UPDATE ON sheq_companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sheq_documents_updated_at
  BEFORE UPDATE ON sheq_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sheq_personnel_updated_at
  BEFORE UPDATE ON sheq_personnel
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sheq_personnel_documents_updated_at
  BEFORE UPDATE ON sheq_personnel_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();