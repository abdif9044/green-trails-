
-- This SQL will be executed to create the media storage buckets with proper permissions

-- Create media bucket if it doesn't exist
CREATE BUCKET IF NOT EXISTS media;
GRANT ALL ON BUCKET media TO authenticated;
GRANT SELECT ON BUCKET media TO anon;

-- Create trail_images bucket with proper public access
CREATE BUCKET IF NOT EXISTS trail_images;
ALTER BUCKET trail_images SET PUBLIC = true;  -- Make all objects in this bucket publicly accessible
GRANT ALL ON BUCKET trail_images TO authenticated;
GRANT SELECT ON BUCKET trail_images TO anon;

-- Create user_media bucket for user-uploaded content
CREATE BUCKET IF NOT EXISTS user_media;
GRANT ALL ON BUCKET user_media TO authenticated;
GRANT SELECT ON BUCKET user_media TO anon;

-- Create albums bucket for user photo albums
CREATE BUCKET IF NOT EXISTS albums;
GRANT ALL ON BUCKET albums TO authenticated;
GRANT SELECT ON BUCKET albums TO anon;
