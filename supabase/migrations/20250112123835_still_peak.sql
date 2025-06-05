/*
  # Add User Permissions Schema

  1. New Tables
    - `user_permissions` - Stores user page access permissions
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `page_path` (text)
      - `created_at` (timestamptz)

  2. Changes
    - Add `allowed_pages` array column to users table
    - Update user role type to include new roles

  3. Security
    - Enable RLS on new table
    - Add policies for authenticated users
*/

-- Update user roles type
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('superAdmin', 'management', 'admin', 'salesFreek', 'salesFranco', 'salesJeckie'));

-- Add allowed_pages column to users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS allowed_pages text[] DEFAULT '{}';

-- Create user_permissions table
CREATE TABLE IF NOT EXISTS user_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  page_path text NOT NULL,
  created_at timestamptz DEFAULT now(),
  
  -- Add constraint for unique user-page combinations
  UNIQUE(user_id, page_path)
);

-- Enable RLS
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own permissions"
  ON user_permissions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage all permissions"
  ON user_permissions
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'superAdmin'
    )
  );

-- Create indexes
CREATE INDEX idx_user_permissions_user_id ON user_permissions(user_id);