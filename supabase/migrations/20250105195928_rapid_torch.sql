/*
  # Add Invoice Documents Support

  1. New Tables
    - `invoice_documents`
      - `id` (uuid, primary key)
      - `invoice_id` (uuid, references outstanding_invoices)
      - `file_name` (text)
      - `file_path` (text)
      - `uploaded_at` (timestamp)
      - `uploaded_by` (uuid, references auth.users)
      - `file_size` (bigint)
      - `mime_type` (text)

  2. Security
    - Enable RLS on invoice_documents table
    - Add policies for authenticated users
*/

-- Create invoice_documents table
CREATE TABLE IF NOT EXISTS invoice_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES outstanding_invoices(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  uploaded_by uuid REFERENCES auth.users NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  
  -- Add constraints
  CONSTRAINT positive_file_size CHECK (file_size > 0),
  CONSTRAINT valid_mime_type CHECK (mime_type IN ('application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'))
);

-- Enable Row Level Security
ALTER TABLE invoice_documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view documents for invoices they can access"
  ON invoice_documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM outstanding_invoices
      WHERE id = invoice_documents.invoice_id
    )
  );

CREATE POLICY "Users can upload documents"
  ON invoice_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = uploaded_by
  );

-- Create indexes
CREATE INDEX idx_invoice_documents_invoice_id ON invoice_documents(invoice_id);
CREATE INDEX idx_invoice_documents_uploaded_at ON invoice_documents(uploaded_at DESC);

-- Add document_count to outstanding_invoices
ALTER TABLE outstanding_invoices 
ADD COLUMN IF NOT EXISTS document_count integer DEFAULT 0;

-- Create function to update document count
CREATE OR REPLACE FUNCTION update_invoice_document_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE outstanding_invoices
    SET document_count = document_count + 1
    WHERE id = NEW.invoice_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE outstanding_invoices
    SET document_count = document_count - 1
    WHERE id = OLD.invoice_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for document count
CREATE TRIGGER update_invoice_document_count_trigger
  AFTER INSERT OR DELETE ON invoice_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_invoice_document_count();