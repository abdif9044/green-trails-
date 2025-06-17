
-- Phase 1: Create the missing trail_data_sources table that's causing all imports to fail
CREATE TABLE IF NOT EXISTS public.trail_data_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  source_type TEXT NOT NULL,
  url TEXT,
  endpoint TEXT,
  country TEXT,
  state_province TEXT,
  region TEXT,
  is_active BOOLEAN DEFAULT true,
  enabled BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}',
  last_synced TIMESTAMPTZ,
  next_sync TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for trail_data_sources
ALTER TABLE public.trail_data_sources ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (for import operations)
CREATE POLICY "Allow public read access to trail data sources" 
ON public.trail_data_sources 
FOR SELECT 
TO public 
USING (true);

-- Create policy to allow authenticated users to manage sources
CREATE POLICY "Allow authenticated users to manage trail data sources" 
ON public.trail_data_sources 
FOR ALL 
TO authenticated 
USING (true);

-- Insert 12 comprehensive trail data sources covering all Americas regions
INSERT INTO public.trail_data_sources (name, description, source_type, url, country, region, is_active, config) VALUES
('US Hiking Project', 'Mountain Project trail database for the United States', 'hiking_project', 'https://www.hikingproject.com/data', 'United States', 'North America', true, '{"max_trails": 8000, "api_key_required": true}'),
('US OpenStreetMap Trails', 'OpenStreetMap trail data for United States', 'openstreetmap', 'https://overpass-api.de/api', 'United States', 'North America', true, '{"max_trails": 4000, "query_type": "hiking"}'),
('US National Parks Service', 'Official NPS trail data', 'usgs', 'https://www.nps.gov/npgallery/api', 'United States', 'North America', true, '{"max_trails": 3000, "park_focus": true}'),
('Canada Parks Trails', 'Parks Canada official trail database', 'parks_canada', 'https://www.pc.gc.ca/apps/tctr/api', 'Canada', 'North America', true, '{"max_trails": 4000, "language": "en"}'),
('Canada OpenStreetMap', 'Canadian hiking trails from OpenStreetMap', 'openstreetmap', 'https://overpass-api.de/api', 'Canada', 'North America', true, '{"max_trails": 3000, "country_code": "CA"}'),
('British Columbia Trails', 'BC Provincial trail system', 'trails_bc', 'https://catalogue.data.gov.bc.ca/api', 'Canada', 'North America', true, '{"max_trails": 1000, "province": "BC"}'),
('Mexico OpenStreetMap', 'Mexican trail data from OpenStreetMap', 'openstreetmap', 'https://overpass-api.de/api', 'Mexico', 'North America', true, '{"max_trails": 2500, "country_code": "MX"}'),
('Mexico INEGI Trails', 'Instituto Nacional de Estadística y Geografía trail data', 'inegi_mexico', 'https://www.inegi.org.mx/app/api', 'Mexico', 'North America', true, '{"max_trails": 1500, "terrain_focus": true}'),
('Brazil Trails Network', 'Brazilian hiking and nature trails', 'openstreetmap', 'https://overpass-api.de/api', 'Brazil', 'South America', true, '{"max_trails": 1500, "country_code": "BR"}'),
('Argentina Trail System', 'Argentinian trail data', 'openstreetmap', 'https://overpass-api.de/api', 'Argentina', 'South America', true, '{"max_trails": 1000, "country_code": "AR"}'),
('Chile Andean Trails', 'Chilean mountain and coastal trails', 'openstreetmap', 'https://overpass-api.de/api', 'Chile', 'South America', true, '{"max_trails": 1000, "country_code": "CL"}'),
('Colombia Trail Network', 'Colombian biodiversity trail system', 'openstreetmap', 'https://overpass-api.de/api', 'Colombia', 'South America', true, '{"max_trails": 500, "country_code": "CO"}');

-- Clean up any failed bulk import jobs to reset the system
DELETE FROM public.bulk_import_jobs WHERE status = 'error';

-- Create index for better performance on trail data sources
CREATE INDEX IF NOT EXISTS idx_trail_data_sources_active ON public.trail_data_sources(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_trail_data_sources_region ON public.trail_data_sources(region);
CREATE INDEX IF NOT EXISTS idx_trail_data_sources_country ON public.trail_data_sources(country);

-- Ensure trail table has proper indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_trails_country ON public.trails(country);
CREATE INDEX IF NOT EXISTS idx_trails_region ON public.trails(region);
CREATE INDEX IF NOT EXISTS idx_trails_difficulty ON public.trails(difficulty);
CREATE INDEX IF NOT EXISTS idx_trails_location_text ON public.trails USING gin(to_tsvector('english', location));
CREATE INDEX IF NOT EXISTS idx_trails_name_text ON public.trails USING gin(to_tsvector('english', name));
