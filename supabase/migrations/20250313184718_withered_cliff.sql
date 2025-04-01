/*
  # Add Admin Features and App Tiers

  1. New Tables
    - `app_tiers` - Stores available application tiers
      - `id` (text, primary key)
      - `name` (text, not null)
      - `description` (text)
      - `created_at` (timestamptz)
    
    - `admin_credentials` - Stores admin access credentials
      - `id` (uuid, primary key)
      - `password_hash` (text, not null)
      - `created_at` (timestamptz)

  2. Changes
    - Insert default tiers (base, enterprise, community)
    - Add tier column to installable_apps table
    - Add initial admin password hash
    - Enable RLS and set up policies

  3. Security
    - Enable RLS on new tables
    - Add policies for public/admin access
*/

-- Create app_tiers table
CREATE TABLE IF NOT EXISTS app_tiers (
    id text PRIMARY KEY,
    name text NOT NULL,
    description text,
    created_at timestamptz DEFAULT now()
);

-- Insert default tiers first
INSERT INTO app_tiers (id, name, description) 
VALUES 
    ('base', 'Base', 'Basic applications available to all users'),
    ('enterprise', 'Enterprise', 'Premium applications for enterprise users'),
    ('community', 'Community', 'Community-contributed applications')
ON CONFLICT (id) DO NOTHING;

-- Create admin_credentials table
CREATE TABLE IF NOT EXISTS admin_credentials (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    password_hash text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Now that tiers exist, we can safely add the column with the foreign key
ALTER TABLE installable_apps 
ADD COLUMN IF NOT EXISTS tier text REFERENCES app_tiers(id) DEFAULT 'base';

-- Update existing apps to use base tier
UPDATE installable_apps SET tier = 'base' WHERE tier IS NULL;

-- Insert admin password (hash of "Sup3rAdm!n")
INSERT INTO admin_credentials (password_hash)
SELECT '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyBAWjR3Uzxidq'
WHERE NOT EXISTS (SELECT 1 FROM admin_credentials);

-- Enable RLS
ALTER TABLE app_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Allow public read access to app_tiers" ON app_tiers;
DROP POLICY IF EXISTS "Allow admin read access to credentials" ON admin_credentials;

-- Create policies
CREATE POLICY "Allow public read access to app_tiers" 
    ON app_tiers
    FOR SELECT 
    TO public 
    USING (true);

CREATE POLICY "Allow admin read access to credentials" 
    ON admin_credentials
    FOR SELECT 
    TO authenticated 
    USING (true);

-- Grant necessary permissions
GRANT SELECT ON app_tiers TO public;
GRANT SELECT ON admin_credentials TO authenticated;