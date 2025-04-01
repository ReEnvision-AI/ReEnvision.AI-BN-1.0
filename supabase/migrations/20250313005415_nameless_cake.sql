/*
  # Add Calculator Category

  1. Changes
    - Adds Utilities category to calculator app
    - Ensures category exists in categories table
    - Creates app_categories relationship
*/

-- First ensure the Utilities category exists
INSERT INTO categories (id, name)
VALUES (3, 'Utilities')
ON CONFLICT (id) DO NOTHING;

-- Add category relationship for calculator app
INSERT INTO app_categories (app_id, category_id)
VALUES ('a6f2a9f4-9629-406b-bdf4-84e19aa6f68b', 3)
ON CONFLICT (app_id, category_id) DO NOTHING;