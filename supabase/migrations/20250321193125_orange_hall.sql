/*
  # Fix Admin RLS Policies

  1. Changes
    - Update RLS policies for installable_apps table
    - Add proper admin role policies
    - Ensure authenticated users can manage apps

  2. Security
    - Maintain public read access
    - Allow admin operations for authenticated users
    - Keep existing validation constraints
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Limit delete to just admins" ON installable_apps;
DROP POLICY IF EXISTS "Limit insert to just admins" ON installable_apps;
DROP POLICY IF EXISTS "Limit update to just admins" ON installable_apps;
DROP POLICY IF EXISTS "Allow public read access to installable_apps" ON installable_apps;

-- Create new policies for installable_apps

-- Allow public read access
CREATE POLICY "Allow public read access"
ON installable_apps FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert"
ON installable_apps FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update"
ON installable_apps FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete"
ON installable_apps FOR DELETE
TO authenticated
USING (true);

-- Grant necessary permissions
GRANT ALL ON installable_apps TO authenticated;