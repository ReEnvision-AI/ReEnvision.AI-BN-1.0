/*
  # Update Authentication Policies

  1. Changes
    - Modify RLS policies for better authentication handling
    - Add policies for public access to essential tables
    - Ensure proper access control for authenticated users

  2. Security
    - Enable RLS on all tables
    - Set up appropriate policies for different user roles
*/

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Enable read access for all users" ON categories;
DROP POLICY IF EXISTS "Enable read access for all users" ON app_categories;
DROP POLICY IF EXISTS "Enable read access for all users" ON installable_apps;

-- Categories table policies
CREATE POLICY "Allow public read access to categories"
ON categories FOR SELECT
TO public
USING (true);

-- App categories policies
CREATE POLICY "Allow public read access to app_categories"
ON app_categories FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated users to manage app_categories"
ON app_categories
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Installable apps policies
CREATE POLICY "Allow public read access to installable_apps"
ON installable_apps FOR SELECT
TO public
USING (true);

-- Ensure RLS is enabled on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE installable_apps ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT SELECT ON categories TO public;
GRANT SELECT ON app_categories TO public;
GRANT SELECT ON installable_apps TO public;