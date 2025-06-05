-- Create calendar meetings table
CREATE TABLE IF NOT EXISTS calendar_meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  description text NOT NULL,
  date timestamptz NOT NULL,
  start_time text NOT NULL CHECK (start_time ~ '^([0-1][0-9]|2[0-3]):[0-5][0-9]$'),
  end_time text NOT NULL CHECK (end_time ~ '^([0-1][0-9]|2[0-3]):[0-5][0-9]$'),
  attendees text[] NOT NULL DEFAULT '{}',
  company text NOT NULL,
  location text NOT NULL,
  status text NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Add constraint to ensure end time is after start time
  CONSTRAINT valid_meeting_times CHECK (end_time > start_time)
);

-- Enable RLS
ALTER TABLE calendar_meetings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all meetings"
  ON calendar_meetings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create meetings"
  ON calendar_meetings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update meetings"
  ON calendar_meetings FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete meetings"
  ON calendar_meetings FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_calendar_meetings_date ON calendar_meetings(date);
CREATE INDEX idx_calendar_meetings_status ON calendar_meetings(status);
CREATE INDEX idx_calendar_meetings_attendees ON calendar_meetings USING gin (attendees);

-- Create updated_at trigger
CREATE TRIGGER update_calendar_meetings_updated_at
  BEFORE UPDATE ON calendar_meetings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();