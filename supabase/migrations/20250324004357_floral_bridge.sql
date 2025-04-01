/*
  # Add Storage Bucket Policy
  
  1. Changes
    - Create storage bucket for app files
    - Configure bucket settings and limits

  2. Security
    - Ensure proper access control for app storage
    - Set appropriate file size limits
*/

-- Create storage bucket for app files if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('app-files', 'app-files', false, 104857600) -- 100MB limit
ON CONFLICT (id) DO NOTHING;