-- Phase 1: Database Foundation Setup  
-- Create and populate trail_data_sources table with active data sources

-- First add unique constraint on name if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'trail_data_sources_name_key' 
    AND table_name = 'trail_data_sources'
  ) THEN
    -- Remove any duplicate names first using created_at
    DELETE FROM public.trail_data_sources a 
    WHERE a.ctid NOT IN (
      SELECT MIN(b.ctid) FROM public.trail_data_sources b 
      WHERE b.name = a.name
    );
    
    -- Add unique constraint
    ALTER TABLE public.trail_data_sources ADD CONSTRAINT trail_data_sources_name_key UNIQUE (name);
  END IF;
END $$;

-- Insert default trail data sources for bulk imports
INSERT INTO public.trail_data_sources (name, source_type, url, country, state_province, region, is_active, config) VALUES
('US National Parks Service', 'nps', 'https://www.nps.gov/subjects/trails/api/', 'United States', NULL, 'National', true, '{"format": "geojson", "api_version": "v1"}'),
('USGS Recreation Sites', 'usgs', 'https://apps.fs.usda.gov/arcx/rest/services/', 'United States', NULL, 'National', true, '{"format": "geojson", "service": "recreation"}'),
('OpenStreetMap Overpass', 'overpass', 'https://overpass-api.de/api/interpreter', 'Global', NULL, 'Global', true, '{"format": "geojson", "timeout": 180}'),
('Hiking Project API', 'hiking_project', 'https://www.hikingproject.com/data/', 'United States', NULL, 'National', true, '{"format": "json", "requires_key": false}'),
('Minnesota State Parks', 'usgs', 'https://apps.fs.usda.gov/arcx/rest/services/', 'United States', 'Minnesota', 'Midwest', true, '{"format": "geojson", "state_filter": "MN"}'),
('California Trail Systems', 'overpass', 'https://overpass-api.de/api/interpreter', 'United States', 'California', 'West', true, '{"format": "geojson", "region": "california"}'),
('Canada Parks Trails', 'canada_parks', 'https://www.pc.gc.ca/apps/tcoe/data/', 'Canada', NULL, 'National', true, '{"format": "geojson", "lang": "en"}'),
('Mexico INEGI Trails', 'inegi_mx', 'https://www.inegi.org.mx/app/api/denue/v1/', 'Mexico', NULL, 'National', true, '{"format": "geojson", "category": "recreation"}')
ON CONFLICT (name) DO UPDATE SET
  url = EXCLUDED.url,
  is_active = EXCLUDED.is_active,
  config = EXCLUDED.config,
  updated_at = now();

-- Ensure proper permissions for bulk import tables
GRANT ALL ON public.trail_data_sources TO service_role;
GRANT SELECT ON public.trail_data_sources TO authenticated;
GRANT SELECT ON public.trail_data_sources TO anon;

-- Add missing indexes for performance  
CREATE INDEX IF NOT EXISTS idx_trail_data_sources_active ON public.trail_data_sources(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_trail_data_sources_region ON public.trail_data_sources(country, state_province, region);
CREATE INDEX IF NOT EXISTS idx_trail_data_sources_type ON public.trail_data_sources(source_type);

-- Update bulk_import_jobs table to include better error tracking
ALTER TABLE public.bulk_import_jobs ADD COLUMN IF NOT EXISTS config JSONB DEFAULT '{}';
ALTER TABLE public.bulk_import_jobs ADD COLUMN IF NOT EXISTS results JSONB DEFAULT '{}';
ALTER TABLE public.bulk_import_jobs ADD COLUMN IF NOT EXISTS source_errors JSONB DEFAULT '[]';

-- Create function to validate import readiness
CREATE OR REPLACE FUNCTION public.validate_import_readiness()
RETURNS TABLE(
  ready boolean,
  active_sources integer,
  total_sources integer,
  issues text[]
) AS $$
DECLARE
  source_count integer;
  active_count integer;
  issue_list text[] := '{}';
BEGIN
  -- Count total and active sources
  SELECT COUNT(*) INTO source_count FROM public.trail_data_sources;
  SELECT COUNT(*) INTO active_count FROM public.trail_data_sources WHERE is_active = true;
  
  -- Check for issues
  IF source_count = 0 THEN
    issue_list := array_append(issue_list, 'No trail data sources configured');
  END IF;
  
  IF active_count = 0 THEN
    issue_list := array_append(issue_list, 'No active trail data sources available');
  END IF;
  
  IF active_count < 3 THEN
    issue_list := array_append(issue_list, 'Fewer than 3 active sources may result in limited trail variety');
  END IF;
  
  -- Check if bulk insert function exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.routines 
    WHERE routine_name = 'bulk_insert_trails' 
    AND routine_schema = 'public'
  ) THEN
    issue_list := array_append(issue_list, 'Bulk insert function not available');
  END IF;
  
  RETURN QUERY SELECT 
    array_length(issue_list, 1) IS NULL OR array_length(issue_list, 1) = 0,
    active_count,
    source_count,
    issue_list;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;