/*
  # Expand Screenshot Image Types

  1. Changes
    - Update validate_installable_app function to support more image formats
    - Add support for additional image MIME types
    - Improve validation error messages
    - Add AVIF and HEIC support

  2. Security
    - Maintain URL validation
    - Keep size and count limits
*/

-- Update validation function with expanded image type support
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

  -- Validate screenshots array if present
  IF NEW.screenshots IS NOT NULL AND array_length(NEW.screenshots, 1) > 0 THEN
    IF array_length(NEW.screenshots, 1) > 10 THEN
      RAISE EXCEPTION 'Maximum 10 screenshots allowed';
    END IF;
    
    -- Check each screenshot URL
    FOR i IN 1..array_length(NEW.screenshots, 1) LOOP
      -- Expanded image format support
      IF NEW.screenshots[i] !~ '^https?://.*\.(jpg|jpeg|png|gif|webp|avif|heic|tiff|bmp)(\?.*)?$'
         AND NEW.screenshots[i] !~ '^https?://.*\.(JPG|JPEG|PNG|GIF|WEBP|AVIF|HEIC|TIFF|BMP)(\?.*)?$' THEN
        RAISE EXCEPTION 'Invalid screenshot URL format at position %. Supported formats: JPG, PNG, GIF, WebP, AVIF, HEIC, TIFF, BMP', i;
      END IF;
    END LOOP;
  END IF;

  -- Set empty array if screenshots is null
  IF NEW.screenshots IS NULL THEN
    NEW.screenshots := ARRAY[]::text[];
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;