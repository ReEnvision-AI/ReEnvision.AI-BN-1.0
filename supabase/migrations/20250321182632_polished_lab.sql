/*
  # Fix App Store Installation Issues

  1. Changes
    - Add missing foreign key constraints
    - Fix user_apps table relationships
    - Update RLS policies
    - Add indexes for performance

  2. Security
    - Ensure proper RLS policies
    - Add necessary grants
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_apps;
DROP POLICY IF EXISTS "Enable users to view their own data only" ON user_apps;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON user_apps;

-- Recreate user_apps table with proper constraints
DROP TABLE IF EXISTS user_apps;
CREATE TABLE user_apps (
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    app_id uuid REFERENCES installable_apps(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (user_id, app_id)
);

-- Enable RLS
ALTER TABLE user_apps ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to insert"
    ON user_apps
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to view own apps"
    ON user_apps
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete own apps"
    ON user_apps
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_apps_user_id ON user_apps(user_id);
CREATE INDEX IF NOT EXISTS idx_user_apps_app_id ON user_apps(app_id);

-- Grant permissions
GRANT SELECT, INSERT, DELETE ON user_apps TO authenticated;