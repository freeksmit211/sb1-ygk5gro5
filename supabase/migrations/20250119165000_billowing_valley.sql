-- Create todo lists table
CREATE TABLE IF NOT EXISTS todo_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create todo items table
CREATE TABLE IF NOT EXISTS todo_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id uuid REFERENCES todo_lists(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_date timestamptz,
  priority text CHECK (priority IN ('low', 'medium', 'high')),
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE todo_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE todo_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all todo lists"
  ON todo_lists FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create todo lists"
  ON todo_lists FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update todo lists"
  ON todo_lists FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete todo lists"
  ON todo_lists FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Users can view all todo items"
  ON todo_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create todo items"
  ON todo_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update todo items"
  ON todo_items FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete todo items"
  ON todo_items FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_todo_items_list_id ON todo_items(list_id);
CREATE INDEX idx_todo_items_assigned_to ON todo_items(assigned_to);
CREATE INDEX idx_todo_items_due_date ON todo_items(due_date);
CREATE INDEX idx_todo_lists_position ON todo_lists(position);
CREATE INDEX idx_todo_items_position ON todo_items(position);

-- Create updated_at triggers
CREATE TRIGGER update_todo_lists_updated_at
  BEFORE UPDATE ON todo_lists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_todo_items_updated_at
  BEFORE UPDATE ON todo_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();