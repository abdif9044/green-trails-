
-- Create trail_images table
CREATE TABLE IF NOT EXISTS trail_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trail_id UUID NOT NULL REFERENCES trails(id) ON DELETE CASCADE,
  image_path TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  caption TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create album_media table (referenced by delete hook)
CREATE TABLE IF NOT EXISTS album_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_type TEXT,
  caption TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE trail_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_media ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trail_images
CREATE POLICY "Anyone can view trail images" ON trail_images FOR SELECT USING (true);
CREATE POLICY "Users can upload trail images" ON trail_images FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their trail images" ON trail_images FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their trail images" ON trail_images FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for album_media
CREATE POLICY "Users can view their album media" ON album_media FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upload album media" ON album_media FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their album media" ON album_media FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their album media" ON album_media FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_trail_images_trail_id ON trail_images(trail_id);
CREATE INDEX IF NOT EXISTS idx_trail_images_user_id ON trail_images(user_id);
CREATE INDEX IF NOT EXISTS idx_trail_images_is_primary ON trail_images(is_primary);
CREATE INDEX IF NOT EXISTS idx_album_media_album_id ON album_media(album_id);
CREATE INDEX IF NOT EXISTS idx_album_media_user_id ON album_media(user_id);
