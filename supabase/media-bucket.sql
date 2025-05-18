
-- This SQL will be executed to create the media storage buckets with proper permissions

-- Media bucket for general purpose storage
CREATE BUCKET IF NOT EXISTS media;
ALTER BUCKET media SET PUBLIC = true;
GRANT ALL ON BUCKET media TO authenticated;
GRANT SELECT ON BUCKET media TO anon;

-- Trail images bucket with proper public access settings
CREATE BUCKET IF NOT EXISTS trail_images;
ALTER BUCKET trail_images SET PUBLIC = true;
GRANT ALL ON BUCKET trail_images TO authenticated;
GRANT SELECT ON BUCKET trail_images TO anon;

-- User media bucket for profile pictures and other user content
CREATE BUCKET IF NOT EXISTS user_media;
ALTER BUCKET user_media SET PUBLIC = true;
GRANT ALL ON BUCKET user_media TO authenticated;
GRANT SELECT ON BUCKET user_media TO anon;

-- Albums bucket for user photo collections
CREATE BUCKET IF NOT EXISTS albums;
ALTER BUCKET albums SET PUBLIC = true;
GRANT ALL ON BUCKET albums TO authenticated;
GRANT SELECT ON BUCKET albums TO anon;

-- Set CORS configuration for all buckets to enable browser access
-- This is important for web applications to access storage directly
UPDATE storage.buckets 
SET cors_rule = '[{"allow_headers": ["*"], "expose_headers": ["*"], "max_age_seconds": 3600, "allowed_origins": ["*"], "allowed_methods": ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"]}]'::jsonb 
WHERE id IN ('trail_images', 'user_media', 'albums', 'media');
