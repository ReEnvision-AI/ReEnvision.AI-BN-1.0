/*
  # Seed Default Apps
  
  1. New Data
    - Add default apps to installable_apps table
    - Add app categories relationships
    - Ensure proper foreign key relationships
  
  2. Changes
    - Insert calculator app with proper UUID
    - Add categories for the app
    - Set proper app metadata
*/

-- Insert default apps if they don't exist
INSERT INTO installable_apps (
  id,
  name,
  icon,
  url,
  preferred_width,
  preferred_height,
  min_width,
  min_height,
  description,
  screenshots,
  tier
) VALUES (
  'a6f2a9f4-9629-406b-bdf4-84e19aa6f68b',
  'Calculator',
  'calculator',
  'https://reai-apps.vercel.app/calculator',
  600,
  800,
  300,
  400,
  'Basic calculator with standard operations',
  ARRAY['https://images.unsplash.com/photo-1587145820266-a5951ee6f620.jpg'],
  'base'
) ON CONFLICT (id) DO NOTHING;

-- Ensure categories exist
INSERT INTO categories (id, name)
VALUES 
  (1, 'All'),
  (2, 'Productivity'),
  (3, 'Utilities')
ON CONFLICT (id) DO NOTHING;

-- Add app category relationships
INSERT INTO app_categories (app_id, category_id)
VALUES 
  ('a6f2a9f4-9629-406b-bdf4-84e19aa6f68b', 1),
  ('a6f2a9f4-9629-406b-bdf4-84e19aa6f68b', 3)
ON CONFLICT (app_id, category_id) DO NOTHING;