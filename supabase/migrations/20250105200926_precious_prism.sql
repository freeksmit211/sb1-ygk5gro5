-- Create tables for all the existing Firebase collections
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('superAdmin', 'management', 'officeAdmin', 'sales')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text NOT NULL,
  department text NOT NULL,
  email text NOT NULL,
  landline text,
  cell text NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sales_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date timestamptz NOT NULL,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('meeting', 'call', 'quote', 'order', 'delivery')),
  customer_name text NOT NULL,
  company text NOT NULL,
  status text NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  rep_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sales_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid REFERENCES sales_activities(id) ON DELETE CASCADE,
  rep_id text NOT NULL,
  note text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stock_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name text NOT NULL,
  quantity integer NOT NULL CHECK (quantity >= 0),
  client_name text NOT NULL,
  client_company text NOT NULL,
  assigned_to text NOT NULL CHECK (assigned_to IN ('franco', 'freek', 'jeckie')),
  notes text,
  status text NOT NULL CHECK (status IN ('ready', 'pending', 'shipped')),
  submitted_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all contacts"
  ON contacts FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can view all sales activities"
  ON sales_activities FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can view all feedback"
  ON sales_feedback FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can view all stock items"
  ON stock_items FOR SELECT TO authenticated USING (true);

-- Create indexes
CREATE INDEX idx_contacts_company ON contacts(company);
CREATE INDEX idx_sales_activities_rep_id ON sales_activities(rep_id);
CREATE INDEX idx_sales_activities_date ON sales_activities(date);
CREATE INDEX idx_sales_feedback_activity_id ON sales_feedback(activity_id);
CREATE INDEX idx_stock_items_assigned_to ON stock_items(assigned_to);