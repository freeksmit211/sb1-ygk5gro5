/*
  # Chat System Schema

  1. New Tables
    - `chats`
      - Core chat information and metadata
      - Tracks participants and last activity
    - `chat_messages` 
      - Individual messages within chats
      - Supports text content and read status
    - `chat_participants`
      - Tracks user participation in chats
      - Stores user-specific chat settings

  2. Security
    - RLS enabled on all tables
    - Policies ensure users can only access their own chats
    - Participants can read/write to their chats

  3. Indexes
    - Optimized for common queries
    - Support for real-time updates
*/

-- Create chat status enum
CREATE TYPE chat_status AS ENUM ('active', 'archived');

-- Create message status enum
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read');

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status chat_status DEFAULT 'active',
  last_message_at timestamptz DEFAULT now()
);

-- Create chat_participants table
CREATE TABLE IF NOT EXISTS chat_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid REFERENCES chats(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  joined_at timestamptz DEFAULT now(),
  last_read_at timestamptz DEFAULT now(),
  is_admin boolean DEFAULT false,
  is_muted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(chat_id, user_id)
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid REFERENCES chats(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  content text NOT NULL,
  status message_status DEFAULT 'sent',
  is_system_message boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Chats policies
CREATE POLICY "Users can view their chats"
  ON chats
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_participants
      WHERE chat_id = chats.id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create chats"
  ON chats
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Chat participants policies
CREATE POLICY "Users can view chat participants"
  ON chat_participants
  FOR SELECT
  USING (
    chat_id IN (
      SELECT chat_id FROM chat_participants
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join chats"
  ON chat_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
  );

-- Chat messages policies
CREATE POLICY "Users can view messages in their chats"
  ON chat_messages
  FOR SELECT
  USING (
    chat_id IN (
      SELECT chat_id FROM chat_participants
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to their chats"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    chat_id IN (
      SELECT chat_id FROM chat_participants
      WHERE user_id = auth.uid()
    )
    AND sender_id = auth.uid()
  );

-- Create indexes
CREATE INDEX idx_chat_participants_user_id ON chat_participants(user_id);
CREATE INDEX idx_chat_participants_chat_id ON chat_participants(chat_id);
CREATE INDEX idx_chat_messages_chat_id ON chat_messages(chat_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_chats_last_message_at ON chats(last_message_at);

-- Create function to update chat's last_message_at
CREATE OR REPLACE FUNCTION update_chat_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chats
  SET last_message_at = NEW.created_at,
      updated_at = NEW.created_at
  WHERE id = NEW.chat_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating chat's last_message_at
CREATE TRIGGER update_chat_last_message_trigger
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_last_message();

-- Create function to update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_chats_updated_at
  BEFORE UPDATE ON chats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_participants_updated_at
  BEFORE UPDATE ON chat_participants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_messages_updated_at
  BEFORE UPDATE ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();