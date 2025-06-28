
-- Create missing social tables
CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Create activity_feed table for social features
CREATE TABLE IF NOT EXISTS activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('trail_like', 'trail_complete', 'album_create', 'follow', 'comment')),
  trail_id UUID REFERENCES trails(id) ON DELETE CASCADE,
  album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create bulk_import_jobs table for trail imports
CREATE TABLE IF NOT EXISTS bulk_import_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  total_trails_requested INTEGER DEFAULT 0,
  total_sources INTEGER DEFAULT 0,
  trails_processed INTEGER DEFAULT 0,
  trails_added INTEGER DEFAULT 0,
  trails_updated INTEGER DEFAULT 0,
  trails_failed INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create trail_import_jobs table
CREATE TABLE IF NOT EXISTS trail_import_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  trails_processed INTEGER DEFAULT 0,
  trails_added INTEGER DEFAULT 0,
  trails_updated INTEGER DEFAULT 0,
  trails_failed INTEGER DEFAULT 0,
  error_message TEXT,
  bulk_job_id UUID REFERENCES bulk_import_jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add email column to profiles if it doesn't exist (needed for social features)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Add missing parking spot columns to match interface
ALTER TABLE parking_spots 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS is_free BOOLEAN,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Rename lat/lon to latitude/longitude for consistency
ALTER TABLE parking_spots 
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- Copy data from lat/lon to latitude/longitude if needed
UPDATE parking_spots SET latitude = lat WHERE latitude IS NULL;
UPDATE parking_spots SET longitude = lon WHERE longitude IS NULL;

-- Enable RLS on new tables
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE trail_import_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for follows
CREATE POLICY "Users can view all follows" ON follows FOR SELECT USING (true);
CREATE POLICY "Users can create their own follows" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can delete their own follows" ON follows FOR DELETE USING (auth.uid() = follower_id);

-- RLS Policies for activity_feed
CREATE POLICY "Users can view all activity" ON activity_feed FOR SELECT USING (true);
CREATE POLICY "Users can create their own activity" ON activity_feed FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for import jobs (admin only for now)
CREATE POLICY "Anyone can view import jobs" ON bulk_import_jobs FOR SELECT USING (true);
CREATE POLICY "Anyone can view trail import jobs" ON trail_import_jobs FOR SELECT USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_user_id ON activity_feed(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_created_at ON activity_feed(created_at);
CREATE INDEX IF NOT EXISTS idx_bulk_import_jobs_status ON bulk_import_jobs(status);
CREATE INDEX IF NOT EXISTS idx_trail_import_jobs_bulk_job_id ON trail_import_jobs(bulk_job_id);
