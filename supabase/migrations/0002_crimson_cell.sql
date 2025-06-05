/*
  # Add Invoice Management Tables

  1. New Tables
    - `outstanding_invoices`
      - `id` (uuid, primary key)
      - `customer_name` (text)
      - `company` (text)
      - `invoice_number` (text, unique)
      - `amount` (numeric)
      - `due_date` (timestamptz)
      - `description` (text)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `invoice_notes`
      - `id` (uuid, primary key)
      - `invoice_id` (uuid, foreign key)
      - `note` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create invoice status enum
CREATE TYPE invoice_status AS ENUM ('pending', 'paid');

-- Create outstanding_invoices table
CREATE TABLE IF NOT EXISTS outstanding_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  company text NOT NULL,
  invoice_number text UNIQUE NOT NULL,
  amount numeric NOT NULL CHECK (amount >= 0),
  due_date timestamptz NOT NULL,
  description text NOT NULL,
  status invoice_status NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create invoice_notes table
CREATE TABLE IF NOT EXISTS invoice_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES outstanding_invoices(id) ON DELETE CASCADE,
  note text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE outstanding_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for outstanding_invoices
CREATE POLICY "Users can view all invoices"
  ON outstanding_invoices
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create invoices"
  ON outstanding_invoices
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update invoices"
  ON outstanding_invoices
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for invoice_notes
CREATE POLICY "Users can view all notes"
  ON invoice_notes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create notes"
  ON invoice_notes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_outstanding_invoices_updated_at
  BEFORE UPDATE ON outstanding_invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_invoice_notes_updated_at
  BEFORE UPDATE ON invoice_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create indexes
CREATE INDEX idx_outstanding_invoices_status ON outstanding_invoices(status);
CREATE INDEX idx_outstanding_invoices_due_date ON outstanding_invoices(due_date);
CREATE INDEX idx_invoice_notes_invoice_id ON invoice_notes(invoice_id);