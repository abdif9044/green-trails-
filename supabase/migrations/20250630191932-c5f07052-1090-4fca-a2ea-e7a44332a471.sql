-- Phase 1: Database Schema & Infrastructure Setup
-- Fix trails table schema for real trail data with PostGIS support

-- Add proper geometry column for spatial queries
ALTER TABLE public.trails ADD COLUMN IF NOT EXISTS geom geometry(LineString, 4326);

-- Add spatial index for fast geometric queries
CREATE INDEX IF NOT EXISTS idx_trails_geom ON public.trails USING GIST(geom);

-- Add source-based indexes for efficient filtering
CREATE INDEX IF NOT EXISTS idx_trails_source ON public.trails(source);
CREATE INDEX IF NOT EXISTS idx_trails_location ON public.trails(location);

-- Create bulk insert function for efficient data loading
CREATE OR REPLACE FUNCTION public.bulk_insert_trails(payload JSONB)
RETURNS TABLE(inserted_count INTEGER, updated_count INTEGER) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    trail_record JSONB;
    inserted_cnt INTEGER := 0;
    updated_cnt INTEGER := 0;
    trail_id UUID;
    existing_id UUID;
BEGIN
    -- Loop through each trail in the payload
    FOR trail_record IN SELECT * FROM jsonb_array_elements(payload)
    LOOP
        -- Extract or generate trail ID
        trail_id := COALESCE(
            (trail_record->>'id')::UUID,
            gen_random_uuid()
        );
        
        -- Check if trail already exists by source and name
        SELECT id INTO existing_id 
        FROM public.trails 
        WHERE source = (trail_record->>'source') 
        AND name = (trail_record->>'name')
        LIMIT 1;
        
        IF existing_id IS NOT NULL THEN
            -- Update existing trail
            UPDATE public.trails SET
                location = COALESCE(trail_record->>'location', location),
                difficulty = COALESCE((trail_record->>'difficulty')::trail_difficulty, difficulty),
                length = COALESCE((trail_record->>'length')::NUMERIC, length),
                elevation_gain = COALESCE((trail_record->>'elevation_gain')::INTEGER, elevation_gain),
                lat = COALESCE((trail_record->>'latitude')::DOUBLE PRECISION, lat),
                lon = COALESCE((trail_record->>'longitude')::DOUBLE PRECISION, lon),
                latitude = COALESCE((trail_record->>'latitude')::DOUBLE PRECISION, latitude),
                longitude = COALESCE((trail_record->>'longitude')::DOUBLE PRECISION, longitude),
                route_geojson = COALESCE((trail_record->>'geojson')::JSONB, route_geojson),
                description = COALESCE(trail_record->>'description', description),
                geom = CASE 
                    WHEN trail_record->>'geojson' IS NOT NULL 
                    THEN ST_GeomFromGeoJSON(trail_record->>'geojson')
                    WHEN (trail_record->>'latitude') IS NOT NULL AND (trail_record->>'longitude') IS NOT NULL
                    THEN ST_MakePoint((trail_record->>'longitude')::DOUBLE PRECISION, (trail_record->>'latitude')::DOUBLE PRECISION)::geometry
                    ELSE geom
                END
            WHERE id = existing_id;
            
            updated_cnt := updated_cnt + 1;
        ELSE
            -- Insert new trail
            INSERT INTO public.trails (
                id, name, location, difficulty, length, elevation_gain,
                lat, lon, latitude, longitude, route_geojson, description, source, status,
                geom, created_at
            ) VALUES (
                trail_id,
                trail_record->>'name',
                trail_record->>'location',
                (trail_record->>'difficulty')::trail_difficulty,
                (trail_record->>'length')::NUMERIC,
                (trail_record->>'elevation_gain')::INTEGER,
                (trail_record->>'latitude')::DOUBLE PRECISION,
                (trail_record->>'longitude')::DOUBLE PRECISION,
                (trail_record->>'latitude')::DOUBLE PRECISION,
                (trail_record->>'longitude')::DOUBLE PRECISION,
                (trail_record->>'geojson')::JSONB,
                trail_record->>'description',
                trail_record->>'source',
                COALESCE(trail_record->>'status', 'approved'),
                CASE 
                    WHEN trail_record->>'geojson' IS NOT NULL 
                    THEN ST_GeomFromGeoJSON(trail_record->>'geojson')
                    WHEN (trail_record->>'latitude') IS NOT NULL AND (trail_record->>'longitude') IS NOT NULL
                    THEN ST_MakePoint((trail_record->>'longitude')::DOUBLE PRECISION, (trail_record->>'latitude')::DOUBLE PRECISION)::geometry
                    ELSE NULL
                END,
                NOW()
            );
            
            inserted_cnt := inserted_cnt + 1;
        END IF;
    END LOOP;
    
    RETURN QUERY SELECT inserted_cnt, updated_cnt;
END;
$$;

-- Temporarily disable RLS for bulk imports (will re-enable with proper policies later)
ALTER TABLE public.trails DISABLE ROW LEVEL SECURITY;

-- Create storage bucket for trail datasets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('trail-imports', 'trail-imports', false)
ON CONFLICT (id) DO NOTHING;