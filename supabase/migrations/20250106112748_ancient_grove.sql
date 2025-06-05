-- Create job status enum
CREATE TYPE job_status AS ENUM ('planned', 'in-progress', 'completed', 'on-hold');

-- Create job priority enum
CREATE TYPE job_priority AS ENUM ('low', 'medium', 'high');

-- Create jobs table
CREATE TABLE jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  job_date timestamptz NOT NULL,
  status job_status NOT NULL DEFAULT 'planned',
  priority job_priority NOT NULL DEFAULT 'medium',
  assigned_to text[] NOT NULL DEFAULT '{}',
  client text NOT NULL,
  budget numeric NOT NULL CHECK (budget >= 0),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Add constraints
  CONSTRAINT valid_job_date CHECK (job_date >= CURRENT_DATE)
);

-- Enable RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create jobs"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_jobs_job_date ON jobs(job_date);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_client ON jobs(client);

-- Create updated_at trigger
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();