
-- This SQL will be executed to create the media storage bucket
CREATE BUCKET IF NOT EXISTS media;
GRANT ALL ON BUCKET media TO authenticated;
GRANT SELECT ON BUCKET media TO anon;
