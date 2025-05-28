
-- Create function to find trails within a radius using PostGIS
CREATE OR REPLACE FUNCTION trails_within_radius(
  center_lat DOUBLE PRECISION,
  center_lng DOUBLE PRECISION,
  radius_meters INTEGER
)
RETURNS TABLE(
  id TEXT,
  name TEXT,
  location TEXT,
  description TEXT,
  difficulty TEXT,
  elevation INTEGER,
  elevation_gain INTEGER,
  trail_length DOUBLE PRECISION,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  country TEXT,
  region TEXT,
  terrain_type TEXT,
  is_age_restricted BOOLEAN,
  is_verified BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  user_id TEXT,
  geojson JSONB,
  trail_tags JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.name,
    t.location,
    t.description,
    t.difficulty,
    t.elevation,
    t.elevation_gain,
    t.trail_length,
    t.latitude,
    t.longitude,
    t.country,
    t.region,
    t.terrain_type,
    t.is_age_restricted,
    t.is_verified,
    t.created_at,
    t.updated_at,
    t.user_id,
    t.geojson,
    COALESCE(
      (
        SELECT jsonb_agg(jsonb_build_object('tag_name', tt.tag_name))
        FROM trail_tags tt
        WHERE tt.trail_id = t.id
      ),
      '[]'::jsonb
    ) as trail_tags
  FROM trails t
  WHERE ST_DWithin(
    ST_SetSRID(ST_MakePoint(t.longitude, t.latitude), 4326)::geography,
    ST_SetSRID(ST_MakePoint(center_lng, center_lat), 4326)::geography,
    radius_meters
  )
  ORDER BY ST_Distance(
    ST_SetSRID(ST_MakePoint(t.longitude, t.latitude), 4326)::geography,
    ST_SetSRID(ST_MakePoint(center_lng, center_lat), 4326)::geography
  );
END;
$$;
