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
  type text NOT NULL CHECK (type IN ('safetyFile', 'medicals', 'inductions')),
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
  type text NOT NULL CHECK (type IN ('medicals', 'inductions')),
  expiry_date timestamptz NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS and create policies (rest of the file remains the same)