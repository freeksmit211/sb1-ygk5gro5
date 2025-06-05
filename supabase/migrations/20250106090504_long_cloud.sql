-- Drop existing RLS policies if they exist
DROP POLICY IF EXISTS "Users can view all stock items" ON stock_items;
DROP POLICY IF EXISTS "Users can create stock items" ON stock_items;
DROP POLICY IF EXISTS "Users can update stock items" ON stock_items;

-- Create new RLS policies with proper permissions
CREATE POLICY "Enable read access for authenticated users"
  ON stock_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON stock_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON stock_items
  FOR UPDATE
  TO authenticated
  USING (true);

-- Ensure RLS is enabled
ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;