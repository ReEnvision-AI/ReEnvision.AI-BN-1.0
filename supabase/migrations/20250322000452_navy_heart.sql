/*
  # Add App Storage Support
  
  1. Changes
    - Add app_storage column to file_system table
    - Add app_id foreign key constraint
    - Update RLS policies for app storage access
    - Add indexes for performance

  2. Security
    - Ensure proper access control for app storage
    - Maintain existing file system security
*/

-- Add app_storage column and foreign key
ALTER TABLE file_system
ADD COLUMN app_id uuid REFERENCES installable_apps(id) ON DELETE CASCADE;

-- Create index for app storage queries
CREATE INDEX idx_file_system_app_id ON file_system(app_id);

-- Update RLS policies to handle app storage
CREATE POLICY "Apps can access their storage"
    ON file_system
    FOR ALL
    TO authenticated
    USING (
        (app_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM user_apps 
            WHERE user_apps.app_id = file_system.app_id 
            AND user_apps.user_id = auth.uid()
        )) OR
        (app_id IS NULL AND owner_id = auth.uid())
    )
    WITH CHECK (
        (app_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM user_apps 
            WHERE user_apps.app_id = file_system.app_id 
            AND user_apps.user_id = auth.uid()
        )) OR
        (app_id IS NULL AND owner_id = auth.uid())
    );

-- Create storage bucket for app files
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('app-files', 'app-files', false, 104857600) -- 100MB limit
ON CONFLICT (id) DO NOTHING;

-- Storage bucket policies for app files
CREATE POLICY "Apps can access their storage files"
    ON storage.objects
    FOR ALL
    TO authenticated
    USING (
        bucket_id = 'app-files' AND 
        EXISTS (
            SELECT 1 FROM user_apps 
            WHERE user_apps.app_id = (SELECT app_id FROM file_system WHERE storage_path = name)
            AND user_apps.user_id = auth.uid()
        )
    );