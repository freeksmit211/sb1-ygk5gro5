-- Create sales appointments table
CREATE TABLE IF NOT EXISTS sales_appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rep_id text NOT NULL CHECK (rep_id IN ('franco', 'freek', 'jeckie')),
  company_name text NOT NULL,
  customer_name text NOT NULL,
  date timestamptz NOT NULL,
  time text NOT NULL,
  subject text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sales appointment feedback table
CREATE TABLE IF NOT EXISTS sales_appointment_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES sales_appointments(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE sales_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_appointment_feedback ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all appointments"
  ON sales_appointments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create appointments"
  ON sales_appointments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update appointments"
  ON sales_appointments FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can view all feedback"
  ON sales_appointment_feedback FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create feedback"
  ON sales_appointment_feedback FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_sales_appointments_rep_id ON sales_appointments(rep_id);
CREATE INDEX idx_sales_appointments_date ON sales_appointments(date);
CREATE INDEX idx_sales_appointment_feedback_appointment_id ON sales_appointment_feedback(appointment_id);

-- Create updated_at triggers
CREATE TRIGGER update_sales_appointments_updated_at
  BEFORE UPDATE ON sales_appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_appointment_feedback_updated_at
  BEFORE UPDATE ON sales_appointment_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();