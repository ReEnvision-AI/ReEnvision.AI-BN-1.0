/*
  # File System Schema

  1. New Tables
    - `file_system` - Stores file and folder metadata
      - `id` (uuid, primary key)
      - `name` (text, not null) - File/folder name
      - `path` (text, not null) - Full path
      - `type` (text, not null) - 'file' or 'folder'
      - `mime_type` (text) - MIME type for files
      - `size` (bigint) - File size in bytes
      - `parent_id` (uuid) - Reference to parent folder
      - `owner_id` (uuid, not null) - Reference to user
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `storage_path` (text) - Path in storage bucket
      - `is_favorite` (boolean)
      - `is_shared` (boolean)
      - `metadata` (jsonb) - Additional metadata

  2. Security
    - Enable RLS
    - Add policies for user access control
    - Create indexes for performance
*/

-- Create file_system table
CREATE TABLE file_system (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    path text NOT NULL,
    type text NOT NULL CHECK (type IN ('file', 'folder')),
    mime_type text,
    size bigint,
    parent_id uuid REFERENCES file_system(id) ON DELETE CASCADE,
    owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    storage_path text,
    is_favorite boolean DEFAULT false,
    is_shared boolean DEFAULT false,
    metadata jsonb,
    CONSTRAINT valid_name CHECK (length(name) > 0 AND name !~ '[/\\]'),
    CONSTRAINT valid_path CHECK (path ~ '^/.*'),
    CONSTRAINT valid_mime_type CHECK (
        type = 'folder' OR 
        (type = 'file' AND mime_type IS NOT NULL)
    )
);

-- Create indexes
CREATE INDEX idx_file_system_owner_id ON file_system(owner_id);
CREATE INDEX idx_file_system_parent_id ON file_system(parent_id);
CREATE INDEX idx_file_system_path ON file_system(path);
CREATE INDEX idx_file_system_type ON file_system(type);

-- Enable RLS
ALTER TABLE file_system ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own files"
    ON file_system
    FOR SELECT
    TO authenticated
    USING (
        owner_id = auth.uid() OR 
        (is_shared = true)
    );

CREATE POLICY "Users can create files"
    ON file_system
    FOR INSERT
    TO authenticated
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own files"
    ON file_system
    FOR UPDATE
    TO authenticated
    USING (owner_id = auth.uid())
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can delete their own files"
    ON file_system
    FOR DELETE
    TO authenticated
    USING (owner_id = auth.uid());

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_file_system_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_file_system_timestamp
    BEFORE UPDATE ON file_system
    FOR EACH ROW
    EXECUTE FUNCTION update_file_system_updated_at();

-- Create storage bucket for files
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-files', 'user-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage bucket policies
CREATE POLICY "Users can view their own files"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (bucket_id = 'user-files' AND owner = auth.uid());

CREATE POLICY "Users can upload files"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'user-files' AND owner = auth.uid());

CREATE POLICY "Users can update their files"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'user-files' AND owner = auth.uid());

CREATE POLICY "Users can delete their files"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'user-files' AND owner = auth.uid());

-- Grant permissions
GRANT ALL ON file_system TO authenticated;