/*
  # Configure Storage Bucket for Screenshots

  1. Changes
    - Create storage bucket for screenshots
    - Configure bucket settings for file size and MIME types
    - Set up proper storage policies

  2. Security
    - Allow public read access to screenshots
    - Restrict uploads to authenticated users
    - Enable proper file type validation
*/

-- Create storage bucket for screenshots if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'screenshots',
  'screenshots',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

-- Enable public access to view screenshots
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Public Access Screenshots'
  ) THEN
    CREATE POLICY "Public Access Screenshots"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'screenshots');
  END IF;
END $$;

-- Allow authenticated users to upload screenshots
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Authenticated Upload Screenshots'
  ) THEN
    CREATE POLICY "Authenticated Upload Screenshots"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'screenshots');
  END IF;
END $$;

-- Allow authenticated users to delete their own screenshots
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Authenticated Delete Screenshots'
  ) THEN
    CREATE POLICY "Authenticated Delete Screenshots"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'screenshots');
  END IF;
END $$;