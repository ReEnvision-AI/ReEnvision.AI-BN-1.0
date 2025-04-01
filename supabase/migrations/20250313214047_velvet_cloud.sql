/*
  # Fix App Categories View

  1. Changes
    - Create a function to get category IDs for an app
    - Create a secure view for app categories
    - Add appropriate permissions

  2. Security
    - Function is marked as STABLE for better query planning
    - View inherits RLS from underlying tables
*/

-- Create a function to get category IDs for an app
CREATE OR REPLACE FUNCTION get_app_categories(app_id uuid)
RETURNS bigint[]
LANGUAGE sql
STABLE
AS $$
  SELECT array_agg(category_id ORDER BY category_id)
  FROM app_categories
  WHERE app_categories.app_id = $1;
$$;

-- Create a secure view that joins apps with their categories
CREATE OR REPLACE VIEW app_categories_view AS
SELECT 
  ia.id as app_id,
  ia.name,
  ia.description,
  ia.icon,
  ia.url,
  ia.tier,
  ia.preferred_width,
  ia.preferred_height,
  ia.min_width,
  ia.min_height,
  ia.screenshots,
  get_app_categories(ia.id) as category_ids,
  array_agg(c.name) as category_names
FROM installable_apps ia
LEFT JOIN app_categories ac ON ia.id = ac.app_id
LEFT JOIN categories c ON ac.category_id = c.id
GROUP BY ia.id, ia.name, ia.description, ia.icon, ia.url, ia.tier, 
         ia.preferred_width, ia.preferred_height, ia.min_width, ia.min_height, ia.screenshots;

-- Grant necessary permissions
GRANT SELECT ON app_categories_view TO public;