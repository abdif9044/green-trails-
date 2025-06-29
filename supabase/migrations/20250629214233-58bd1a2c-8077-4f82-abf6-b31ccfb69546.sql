
-- Create missing tables for the GreenTrails app

-- Performance metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_difficulty TEXT CHECK (preferred_difficulty IN ('easy', 'moderate', 'hard')),
  preferred_length_range NUMRANGE,
  favorite_tags TEXT[],
  location_preferences JSONB,
  time_of_day TEXT CHECK (time_of_day IN ('morning', 'afternoon', 'evening')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Trail interactions table
CREATE TABLE IF NOT EXISTS trail_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trail_id UUID NOT NULL REFERENCES trails(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'like', 'comment', 'share', 'save')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Trail likes table (separate from trail_interactions for performance)
CREATE TABLE IF NOT EXISTS trail_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trail_id UUID NOT NULL REFERENCES trails(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, trail_id)
);

-- Hike sessions table for GPS tracking
CREATE TABLE IF NOT EXISTS hike_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trail_id UUID REFERENCES trails(id) ON DELETE SET NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- in seconds
  total_distance NUMERIC(10,2), -- in miles
  total_elevation_gain INTEGER, -- in feet
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  positions JSONB, -- array of GPS positions
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Security audit log table
CREATE TABLE IF NOT EXISTS security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User memory table for AI chat
CREATE TABLE IF NOT EXISTS user_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  memory_type TEXT NOT NULL CHECK (memory_type IN ('preference', 'fact', 'interaction', 'context')),
  content TEXT NOT NULL,
  metadata JSONB,
  importance_score INTEGER DEFAULT 1 CHECK (importance_score BETWEEN 1 AND 10),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_performance_metrics_user_id ON performance_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_metric_name ON performance_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_created_at ON performance_metrics(created_at);

CREATE INDEX IF NOT EXISTS idx_trail_interactions_user_id ON trail_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_trail_interactions_trail_id ON trail_interactions(trail_id);
CREATE INDEX IF NOT EXISTS idx_trail_interactions_type ON trail_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_trail_interactions_created_at ON trail_interactions(created_at);

CREATE INDEX IF NOT EXISTS idx_trail_likes_user_id ON trail_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_trail_likes_trail_id ON trail_likes(trail_id);

CREATE INDEX IF NOT EXISTS idx_hike_sessions_user_id ON hike_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_hike_sessions_trail_id ON hike_sessions(trail_id);
CREATE INDEX IF NOT EXISTS idx_hike_sessions_status ON hike_sessions(status);
CREATE INDEX IF NOT EXISTS idx_hike_sessions_start_time ON hike_sessions(start_time);

CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_event_type ON security_audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at ON security_audit_log(created_at);

CREATE INDEX IF NOT EXISTS idx_user_memory_user_id ON user_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_user_memory_type ON user_memory(memory_type);
CREATE INDEX IF NOT EXISTS idx_user_memory_importance ON user_memory(importance_score);
CREATE INDEX IF NOT EXISTS idx_user_memory_expires_at ON user_memory(expires_at);

-- Add missing latitude/longitude columns to trails table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'trails' AND column_name = 'latitude') THEN
    ALTER TABLE trails ADD COLUMN latitude DOUBLE PRECISION;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'trails' AND column_name = 'longitude') THEN
    ALTER TABLE trails ADD COLUMN longitude DOUBLE PRECISION;
  END IF;
END $$;

-- Update existing lat/lon data to latitude/longitude if needed
UPDATE trails SET latitude = lat WHERE latitude IS NULL AND lat IS NOT NULL;
UPDATE trails SET longitude = lon WHERE longitude IS NULL AND lon IS NOT NULL;

-- Enable RLS on all new tables
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE trail_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trail_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE hike_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_memory ENABLE ROW LEVEL SECURITY;

-- RLS Policies for performance_metrics
CREATE POLICY "Users can view their own performance metrics" ON performance_metrics
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own performance metrics" ON performance_metrics
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_preferences
CREATE POLICY "Users can manage their own preferences" ON user_preferences
FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for trail_interactions
CREATE POLICY "Users can view their own interactions" ON trail_interactions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interactions" ON trail_interactions
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for trail_likes
CREATE POLICY "Users can manage their own likes" ON trail_likes
FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for hike_sessions
CREATE POLICY "Users can manage their own hike sessions" ON hike_sessions
FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for security_audit_log (admin only)
CREATE POLICY "Service role can manage security audit log" ON security_audit_log
FOR ALL TO service_role USING (true);

-- RLS Policies for user_memory
CREATE POLICY "Users can manage their own memory" ON user_memory
FOR ALL USING (auth.uid() = user_id);
