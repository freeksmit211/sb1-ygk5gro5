-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('sheq', 'sheq', true),
  ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the buckets
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for sheq bucket
CREATE POLICY "Allow public read access for sheq bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'sheq');

CREATE POLICY "Allow authenticated uploads to sheq bucket"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'sheq');

-- Create policies for documents bucket
CREATE POLICY "Allow public read access for documents bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents');

CREATE POLICY "Allow authenticated uploads to documents bucket"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'documents');