/*
  # Company Notices System
  
  1. New Tables
    - `notices`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `priority` (enum: low, medium, high)
      - `created_at` (timestamptz)
      - `created_by` (uuid, references auth.users)
      - `expires_at` (timestamptz, nullable)
      
  2. Security
    - Enable RLS on notices table
    - Add policies for authenticated users
*/

-- Create priority enum
CREATE TYPE notice_priority AS ENUM ('low', 'medium', 'high');

-- Create notices table
CREATE TABLE IF NOT EXISTS notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  priority notice_priority NOT NULL DEFAULT 'medium',
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users NOT NULL,
  expires_at timestamptz,
  
  CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);

-- Enable RLS
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all notices"
  ON notices
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create notices"
  ON notices
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Create index for faster queries
CREATE INDEX idx_notices_created_at ON notices(created_at DESC);
CREATE INDEX idx_notices_expires_at ON notices(expires_at);