/*
  # Fix Contacts RLS Policies

  1. Updates
    - Add missing RLS policies for contacts table
    - Allow authenticated users to perform CRUD operations
*/

-- Update contacts RLS policies
DROP POLICY IF EXISTS "Users can view all contacts" ON contacts;
DROP POLICY IF EXISTS "Users can create contacts" ON contacts;
DROP POLICY IF EXISTS "Users can update contacts" ON contacts;

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

CREATE POLICY "Users can delete contacts"
  ON contacts FOR DELETE
  TO authenticated
  USING (true);