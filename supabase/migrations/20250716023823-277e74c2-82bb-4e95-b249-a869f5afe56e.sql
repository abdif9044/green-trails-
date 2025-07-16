
-- Create advanced trail search and filtering functions for Phase 3B

-- Function to search trails within a radius using geographic coordinates
CREATE OR REPLACE FUNCTION trails_within_radius(
  center_lat DOUBLE PRECISION,
  center_lng DOUBLE PRECISION,
  radius_km INTEGER DEFAULT 50
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  location TEXT,
  description TEXT,
  difficulty trail_difficulty,
  length NUMERIC,
  elevation_gain INTEGER,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  tags TEXT[],
  photos TEXT[],
  features TEXT[],
  best_seasons TEXT[],
  surface_type TEXT,
  accessibility_features TEXT[],
  permit_required BOOLEAN,
  dogs_allowed BOOLEAN,
  camping_available BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  data_quality_score NUMERIC
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.name,
    t.location,
    t.description,
    t.difficulty,
    t.length,
    t.elevation_gain,
    COALESCE(t.latitude, t.lat) as latitude,
    COALESCE(t.longitude, t.lon) as longitude,
    COALESCE(t.tags, '{}') as tags,
    COALESCE(t.photos, '{}') as photos,
    COALESCE(t.features, '{}') as features,
    COALESCE(t.best_seasons, '{}') as best_seasons,
    t.surface_type,
    COALESCE(t.accessibility_features, '{}') as accessibility_features,
    t.permit_required,
    t.dogs_allowed,
    t.camping_available,
    t.created_at,
    t.data_quality_score
  FROM trails t
  WHERE t.is_active = true
  AND t.status = 'approved'
  AND COALESCE(t.latitude, t.lat) IS NOT NULL 
  AND COALESCE(t.longitude, t.lon) IS NOT NULL
  AND (
    -- Calculate distance using Haversine formula approximation
    6371 * acos(
      cos(radians(center_lat)) * 
      cos(radians(COALESCE(t.latitude, t.lat))) * 
      cos(radians(COALESCE(t.longitude, t.lon)) - radians(center_lng)) + 
      sin(radians(center_lat)) * 
      sin(radians(COALESCE(t.latitude, t.lat)))
    ) <= radius_km
  )
  ORDER BY (
    -- Distance calculation for ordering
    6371 * acos(
      cos(radians(center_lat)) * 
      cos(radians(COALESCE(t.latitude, t.lat))) * 
      cos(radians(COALESCE(t.longitude, t.lon)) - radians(center_lng)) + 
      sin(radians(center_lat)) * 
      sin(radians(COALESCE(t.latitude, t.lat)))
    )
  )
  LIMIT 100;
END;
$$;

-- Function for advanced trail searching with filters
CREATE OR REPLACE FUNCTION search_trails(
  search_query TEXT DEFAULT NULL,
  filter_difficulty trail_difficulty DEFAULT NULL,
  filter_length_min NUMERIC DEFAULT NULL,
  filter_length_max NUMERIC DEFAULT NULL,
  filter_tags TEXT[] DEFAULT NULL,
  filter_features TEXT[] DEFAULT NULL,
  sort_by TEXT DEFAULT 'name',
  limit_count INTEGER DEFAULT 50,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  location TEXT,
  description TEXT,
  difficulty trail_difficulty,
  length NUMERIC,
  elevation_gain INTEGER,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  tags TEXT[],
  photos TEXT[],
  features TEXT[],
  surface_type TEXT,
  permit_required BOOLEAN,
  dogs_allowed BOOLEAN,
  camping_available BOOLEAN,
  data_quality_score NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  EXECUTE format('
    SELECT 
      t.id,
      t.name,
      t.location,
      t.description,
      t.difficulty,
      t.length,
      t.elevation_gain,
      COALESCE(t.latitude, t.lat) as latitude,
      COALESCE(t.longitude, t.lon) as longitude,
      COALESCE(t.tags, %L) as tags,
      COALESCE(t.photos, %L) as photos,
      COALESCE(t.features, %L) as features,
      t.surface_type,
      t.permit_required,
      t.dogs_allowed,
      t.camping_available,
      t.data_quality_score,
      t.created_at
    FROM trails t
    WHERE t.is_active = true
    AND t.status = %L
    AND ($1 IS NULL OR (
      t.name ILIKE %L OR 
      t.location ILIKE %L OR 
      t.description ILIKE %L
    ))
    AND ($2 IS NULL OR t.difficulty = $2)
    AND ($3 IS NULL OR t.length >= $3)
    AND ($4 IS NULL OR t.length <= $4)
    AND ($5 IS NULL OR t.tags && $5)
    AND ($6 IS NULL OR t.features && $6)
    ORDER BY %s
    LIMIT $7 OFFSET $8
  ', 
  '{}', '{}', '{}', 'approved',
  CASE WHEN search_query IS NOT NULL THEN '%' || search_query || '%' ELSE '%' END,
  CASE WHEN search_query IS NOT NULL THEN '%' || search_query || '%' ELSE '%' END,
  CASE WHEN search_query IS NOT NULL THEN '%' || search_query || '%' ELSE '%' END,
  CASE 
    WHEN sort_by = 'length' THEN 't.length ASC'
    WHEN sort_by = 'difficulty' THEN 't.difficulty ASC'
    WHEN sort_by = 'created' THEN 't.created_at DESC'
    ELSE 't.name ASC'
  END)
  USING search_query, filter_difficulty, filter_length_min, filter_length_max, 
        filter_tags, filter_features, limit_count, offset_count;
END;
$$;

-- Function to get trail statistics for dashboard
CREATE OR REPLACE FUNCTION get_trail_statistics()
RETURNS TABLE(
  total_trails BIGINT,
  active_trails BIGINT,
  trails_by_difficulty JSONB,
  average_length NUMERIC,
  total_elevation_gain BIGINT
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM trails) as total_trails,
    (SELECT COUNT(*) FROM trails WHERE is_active = true AND status = 'approved') as active_trails,
    (SELECT jsonb_object_agg(difficulty, count) 
     FROM (
       SELECT difficulty, COUNT(*) as count 
       FROM trails 
       WHERE is_active = true AND status = 'approved' 
       GROUP BY difficulty
     ) difficulty_counts) as trails_by_difficulty,
    (SELECT ROUND(AVG(length), 2) FROM trails WHERE is_active = true AND length > 0) as average_length,
    (SELECT SUM(elevation_gain) FROM trails WHERE is_active = true AND elevation_gain > 0) as total_elevation_gain;
END;
$$;

-- Function to get trail recommendations based on user preferences
CREATE OR REPLACE FUNCTION get_trail_recommendations(
  user_difficulty trail_difficulty DEFAULT NULL,
  user_length_preference NUMERIC DEFAULT NULL,
  user_location_lat DOUBLE PRECISION DEFAULT NULL,
  user_location_lng DOUBLE PRECISION DEFAULT NULL,
  recommendation_limit INTEGER DEFAULT 10
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  location TEXT,
  difficulty trail_difficulty,
  length NUMERIC,
  elevation_gain INTEGER,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  tags TEXT[],
  photos TEXT[],
  recommendation_score NUMERIC
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.name,
    t.location,
    t.difficulty,
    t.length,
    t.elevation_gain,
    COALESCE(t.latitude, t.lat) as latitude,
    COALESCE(t.longitude, t.lon) as longitude,
    COALESCE(t.tags, '{}') as tags,
    COALESCE(t.photos, '{}') as photos,
    -- Simple scoring algorithm based on preferences
    (
      CASE WHEN user_difficulty IS NOT NULL AND t.difficulty = user_difficulty THEN 50 ELSE 0 END +
      CASE WHEN user_length_preference IS NOT NULL AND ABS(t.length - user_length_preference) <= 2 THEN 30 ELSE 0 END +
      CASE WHEN t.data_quality_score IS NOT NULL THEN t.data_quality_score * 20 ELSE 0 END
    ) as recommendation_score
  FROM trails t
  WHERE t.is_active = true
  AND t.status = 'approved'
  AND COALESCE(t.latitude, t.lat) IS NOT NULL
  AND COALESCE(t.longitude, t.lon) IS NOT NULL
  ORDER BY recommendation_score DESC, t.data_quality_score DESC NULLS LAST
  LIMIT recommendation_limit;
END;
$$;

-- Create indexes for improved performance with 20K+ trails
CREATE INDEX IF NOT EXISTS idx_trails_search_text ON trails USING gin(
  to_tsvector('english', name || ' ' || COALESCE(location, '') || ' ' || COALESCE(description, ''))
);

CREATE INDEX IF NOT EXISTS idx_trails_active_approved ON trails(is_active, status) 
WHERE is_active = true AND status = 'approved';

CREATE INDEX IF NOT EXISTS idx_trails_difficulty_length ON trails(difficulty, length) 
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_trails_coordinates ON trails(latitude, longitude) 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_trails_tags_gin ON trails USING gin(tags) 
WHERE tags IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_trails_features_gin ON trails USING gin(features) 
WHERE features IS NOT NULL;
