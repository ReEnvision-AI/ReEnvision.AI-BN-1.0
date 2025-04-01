/*
  # Fix Calculator App Screenshot URL

  1. Changes
    - Update calculator app's screenshot URL to use a valid image format
    - Ensure URL matches the validation pattern
    - Keep the same image but with proper extension

  2. Security
    - No security changes needed
    - Maintains existing RLS policies
*/

-- Update the calculator app's screenshot URL to use a valid format
UPDATE installable_apps
SET screenshots = ARRAY['https://images.unsplash.com/photo-1587145820266-a5951ee6f620.jpg']
WHERE id = 'a6f2a9f4-9629-406b-bdf4-84e19aa6f68b';