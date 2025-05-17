
-- This SQL will be executed to create the media storage bucket
CREATE BUCKET IF NOT EXISTS media;
GRANT ALL ON BUCKET media TO authenticated;
GRANT SELECT ON BUCKET media TO anon;

-- Create trail_images bucket if it doesn't exist
CREATE BUCKET IF NOT EXISTS trail_images;
GRANT ALL ON BUCKET trail_images TO authenticated;
GRANT SELECT ON BUCKET trail_images TO anon;

