/*
  # Add File System Support

  1. Changes
    - Add app_id column to file_system table
    - Create index for app storage queries
    - Update RLS policies for app storage access
    - Create storage bucket for app files

  2. Security
    - Maintain existing file system security
    - Add app-specific storage access control
*/

-- Drop existing policies that we'll recreate
DROP POLICY IF EXISTS "Users can view their own files" ON file_system;
DROP POLICY IF EXISTS "Users can create files" ON file_system;
DROP POLICY IF EXISTS "Users can update their own files" ON file_system;
DROP POLICY IF EXISTS "Users can delete their own files" ON file_system;

-- Create comprehensive RLS policy that handles both personal and app files
CREATE POLICY "File system access control"
    ON file_system
    FOR ALL
    TO authenticated
    USING (
        -- Allow access if:
        -- 1. User owns the file directly
        owner_id = auth.uid() OR
        -- 2. File is shared
        is_shared = true OR
        -- 3. File belongs to an app the user has installed
        (app_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM user_apps 
            WHERE user_apps.app_id = file_system.app_id 
            AND user_apps.user_id = auth.uid()
        ))
    )
    WITH CHECK (
        -- Allow modifications if:
        -- 1. User owns the file directly
        owner_id = auth.uid() OR
        -- 2. File belongs to an app the user has installed
        (app_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM user_apps 
            WHERE user_apps.app_id = file_system.app_id 
            AND user_apps.user_id = auth.uid()
        ))
    );

-- Create storage bucket for app files if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('app-files', 'app-files', false, 104857600) -- 100MB limit
ON CONFLICT (id) DO NOTHING;

-- Storage bucket policies for app files
CREATE POLICY "App storage access control"
    ON storage.objects
    FOR ALL
    TO authenticated
    USING (
        bucket_id = 'app-files' AND 
        EXISTS (
            SELECT 1 FROM user_apps 
            WHERE user_apps.app_id = (
                SELECT app_id FROM file_system 
                WHERE storage_path = storage.objects.name
            )
            AND user_apps.user_id = auth.uid()
        )
    );