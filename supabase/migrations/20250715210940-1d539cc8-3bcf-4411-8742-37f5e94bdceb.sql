-- Phase 1: Enhanced Trail Data Structure & 3D Foundation
-- Add new columns to trails table for 3D visualization and enhanced trail data

-- Add trail type enum
CREATE TYPE trail_type AS ENUM ('loop', 'out_and_back', 'point_to_point');

-- Add new columns to trails table
ALTER TABLE public.trails 
ADD COLUMN IF NOT EXISTS trail_type trail_type DEFAULT 'out_and_back',
ADD COLUMN IF NOT EXISTS estimated_time TEXT,
ADD COLUMN IF NOT EXISTS elevation_profile JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS terrain_mesh_data JSONB,
ADD COLUMN IF NOT EXISTS waypoints JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS seasonal_conditions JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS trailhead_info JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS best_seasons TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS surface_type TEXT,
ADD COLUMN IF NOT EXISTS accessibility_features TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS permit_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS dogs_allowed BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS camping_available BOOLEAN DEFAULT false;

-- Create index on new searchable fields
CREATE INDEX IF NOT EXISTS idx_trails_trail_type ON public.trails(trail_type);
CREATE INDEX IF NOT EXISTS idx_trails_features ON public.trails USING GIN(features);
CREATE INDEX IF NOT EXISTS idx_trails_best_seasons ON public.trails USING GIN(best_seasons);
CREATE INDEX IF NOT EXISTS idx_trails_surface_type ON public.trails(surface_type);

-- Create waypoints table for better structure
CREATE TABLE IF NOT EXISTS public.trail_waypoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trail_id UUID NOT NULL REFERENCES public.trails(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  waypoint_type TEXT NOT NULL CHECK (waypoint_type IN ('junction', 'viewpoint', 'hazard', 'rest', 'water', 'summit', 'trailhead', 'camping')),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  elevation INTEGER,
  distance_from_start NUMERIC,
  coordinates_3d JSONB,
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on waypoints table
ALTER TABLE public.trail_waypoints ENABLE ROW LEVEL SECURITY;

-- Create policy for waypoints (public read, admin write)
CREATE POLICY "Anyone can view trail waypoints" ON public.trail_waypoints
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage trail waypoints" ON public.trail_waypoints
  FOR ALL USING (public.is_admin());

-- Create indexes for waypoints
CREATE INDEX IF NOT EXISTS idx_trail_waypoints_trail_id ON public.trail_waypoints(trail_id);
CREATE INDEX IF NOT EXISTS idx_trail_waypoints_type ON public.trail_waypoints(waypoint_type);
CREATE INDEX IF NOT EXISTS idx_trail_waypoints_location ON public.trail_waypoints(latitude, longitude);

-- Update trigger for waypoints
CREATE OR REPLACE FUNCTION update_waypoint_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_trail_waypoints_updated_at
    BEFORE UPDATE ON public.trail_waypoints
    FOR EACH ROW
    EXECUTE FUNCTION update_waypoint_updated_at();

-- Create trail_3d_models table for storing 3D visualization data
CREATE TABLE IF NOT EXISTS public.trail_3d_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trail_id UUID NOT NULL REFERENCES public.trails(id) ON DELETE CASCADE,
  model_type TEXT NOT NULL CHECK (model_type IN ('terrain_mesh', 'elevation_profile', 'flythrough_path')),
  model_data JSONB NOT NULL,
  quality_level TEXT DEFAULT 'medium' CHECK (quality_level IN ('low', 'medium', 'high')),
  file_size_kb INTEGER,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on 3d models table
ALTER TABLE public.trail_3d_models ENABLE ROW LEVEL SECURITY;

-- Create policy for 3d models (public read, admin write)
CREATE POLICY "Anyone can view trail 3d models" ON public.trail_3d_models
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage trail 3d models" ON public.trail_3d_models
  FOR ALL USING (public.is_admin());

-- Create indexes for 3d models
CREATE INDEX IF NOT EXISTS idx_trail_3d_models_trail_id ON public.trail_3d_models(trail_id);
CREATE INDEX IF NOT EXISTS idx_trail_3d_models_type ON public.trail_3d_models(model_type);

-- Add some sample enhanced data to existing trails
UPDATE public.trails 
SET 
  trail_type = CASE 
    WHEN name ILIKE '%loop%' THEN 'loop'::trail_type
    WHEN name ILIKE '%point%' OR name ILIKE '%one way%' THEN 'point_to_point'::trail_type
    ELSE 'out_and_back'::trail_type
  END,
  estimated_time = CASE 
    WHEN length <= 2 THEN '1-2 hours'
    WHEN length <= 5 THEN '2-4 hours'
    WHEN length <= 10 THEN '4-6 hours'
    ELSE '6+ hours'
  END,
  features = CASE 
    WHEN tags IS NOT NULL AND array_length(tags, 1) > 0 THEN tags
    ELSE ARRAY['scenic views', 'well maintained']
  END,
  best_seasons = ARRAY['spring', 'summer', 'fall'],
  surface_type = 'dirt',
  dogs_allowed = true,
  trailhead_info = jsonb_build_object(
    'parking', 'Available',
    'facilities', ARRAY['restrooms', 'water'],
    'access_notes', 'Open year-round'
  )
WHERE trail_type IS NULL;