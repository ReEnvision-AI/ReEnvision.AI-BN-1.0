/*
  # Add updated_at column to installable_apps

  1. Changes
    - Add updated_at column to installable_apps table
    - Set default value to now()
    - Update existing rows to have updated_at value
    - Create trigger to automatically update the timestamp
*/

-- Add updated_at column
ALTER TABLE installable_apps 
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Update existing rows to have updated_at equal to created_at
UPDATE installable_apps 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update timestamp
DROP TRIGGER IF EXISTS update_installable_apps_updated_at ON installable_apps;

CREATE TRIGGER update_installable_apps_updated_at
    BEFORE UPDATE ON installable_apps
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();