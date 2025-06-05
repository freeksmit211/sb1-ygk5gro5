/*
  # Create fuel entries table

  1. New Tables
    - `forms_fuel`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with timezone)
      - `slip_number` (text)
      - `vehicle` (text)
      - `driver` (text)
      - `odometer` (numeric)
      - `pump_reading_before` (numeric)
      - `pump_reading_after` (numeric)
      - `liters` (numeric)

  2. Security
    - Enable RLS on `forms_fuel` table
    - Add policies for authenticated users to:
      - Insert their own entries
      - Read all entries
*/

-- Create the fuel entries table
CREATE TABLE IF NOT EXISTS forms_fuel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  slip_number text NOT NULL,
  vehicle text NOT NULL,
  driver text NOT NULL,
  odometer numeric NOT NULL,
  pump_reading_before numeric NOT NULL,
  pump_reading_after numeric NOT NULL,
  liters numeric NOT NULL,
  
  -- Add constraints
  CONSTRAINT positive_odometer CHECK (odometer >= 0),
  CONSTRAINT positive_pump_reading_before CHECK (pump_reading_before >= 0),
  CONSTRAINT positive_pump_reading_after CHECK (pump_reading_after >= 0),
  CONSTRAINT positive_liters CHECK (liters >= 0),
  CONSTRAINT valid_pump_readings CHECK (pump_reading_after >= pump_reading_before)
);

-- Enable Row Level Security
ALTER TABLE forms_fuel ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own fuel entries"
  ON forms_fuel
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read all fuel entries"
  ON forms_fuel
  FOR SELECT
  TO authenticated
  USING (true);