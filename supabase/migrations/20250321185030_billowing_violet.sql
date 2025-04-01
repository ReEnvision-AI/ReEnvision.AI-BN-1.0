/*
  # Add Validation Constraints to Installable Apps

  1. Changes
    - Add NOT NULL constraints to required fields
    - Add check constraints for numeric fields
    - Add validation for URLs and icons
    - Add trigger for validation checks

  2. Security
    - Ensures data integrity
    - Prevents invalid data entry
*/

-- Add NOT NULL constraints to required fields
ALTER TABLE installable_apps
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN icon SET NOT NULL,
  ALTER COLUMN url SET NOT NULL,
  ALTER COLUMN tier SET NOT NULL;

-- Add check constraints for dimensions
ALTER TABLE installable_apps
  ADD CONSTRAINT check_preferred_width 
    CHECK (preferred_width > 0),
  ADD CONSTRAINT check_preferred_height 
    CHECK (preferred_height > 0),
  ADD CONSTRAINT check_min_width 
    CHECK (min_width > 0),
  ADD CONSTRAINT check_min_height 
    CHECK (min_height > 0),
  ADD CONSTRAINT check_min_dimensions 
    CHECK (min_width <= preferred_width AND min_height <= preferred_height);

-- Add URL format validation
ALTER TABLE installable_apps
  ADD CONSTRAINT check_url_format
    CHECK (url ~* '^https?://.*$');

-- Create validation function
CREATE OR REPLACE FUNCTION validate_installable_app()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate icon name (only lowercase letters, numbers, and hyphens)
  IF NEW.icon !~ '^[a-z0-9-]+$' THEN
    RAISE EXCEPTION 'Icon name must contain only lowercase letters, numbers, and hyphens';
  END IF;

  -- Validate name length
  IF length(NEW.name) < 2 OR length(NEW.name) > 100 THEN
    RAISE EXCEPTION 'Name must be between 2 and 100 characters';
  END IF;

  -- Validate description if provided
  IF NEW.description IS NOT NULL AND (length(NEW.description) < 10 OR length(NEW.description) > 500) THEN
    RAISE EXCEPTION 'Description must be between 10 and 500 characters';
  END IF;

  -- Validate screenshots array
  IF NEW.screenshots IS NOT NULL THEN
    IF array_length(NEW.screenshots, 1) > 10 THEN
      RAISE EXCEPTION 'Maximum 10 screenshots allowed';
    END IF;
    -- Check each screenshot URL
    FOR i IN 1..array_length(NEW.screenshots, 1) LOOP
      IF NEW.screenshots[i] !~ '^https?://.*\.(jpg|jpeg|png|gif|webp)(\?.*)?$' THEN
        RAISE EXCEPTION 'Invalid screenshot URL format at position %', i;
      END IF;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for validation
DROP TRIGGER IF EXISTS validate_installable_app_trigger ON installable_apps;
CREATE TRIGGER validate_installable_app_trigger
  BEFORE INSERT OR UPDATE ON installable_apps
  FOR EACH ROW
  EXECUTE FUNCTION validate_installable_app();