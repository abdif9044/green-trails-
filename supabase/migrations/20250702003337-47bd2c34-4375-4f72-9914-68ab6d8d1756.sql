-- Create comprehensive trail import system tables

-- Update trail_data_sources with API keys and enhanced configuration
ALTER TABLE public.trail_data_sources ADD COLUMN IF NOT EXISTS api_key TEXT;
ALTER TABLE public.trail_data_sources ADD COLUMN IF NOT EXISTS rate_limit_per_minute INTEGER DEFAULT 60;
ALTER TABLE public.trail_data_sources ADD COLUMN IF NOT EXISTS last_error TEXT;
ALTER TABLE public.trail_data_sources ADD COLUMN IF NOT EXISTS error_count INTEGER DEFAULT 0;

-- Create import_logs table for detailed tracking
CREATE TABLE IF NOT EXISTS public.import_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.bulk_import_jobs(id) ON DELETE CASCADE,
  source_name TEXT NOT NULL,
  source_type TEXT NOT NULL,
  batch_number INTEGER,
  total_requested INTEGER DEFAULT 0,
  successful_imports INTEGER DEFAULT 0,
  failed_imports INTEGER DEFAULT 0,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  error_details JSONB DEFAULT '[]'::jsonb,
  api_response_sample JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create trail_duplicates table for deduplication tracking
CREATE TABLE IF NOT EXISTS public.trail_duplicates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_trail_id UUID REFERENCES public.trails(id) ON DELETE CASCADE,
  duplicate_source TEXT NOT NULL,
  duplicate_source_id TEXT NOT NULL,
  similarity_score NUMERIC(3,2), -- 0.00 to 1.00
  duplicate_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhance trails table with import tracking
ALTER TABLE public.trails ADD COLUMN IF NOT EXISTS import_job_id UUID REFERENCES public.bulk_import_jobs(id);
ALTER TABLE public.trails ADD COLUMN IF NOT EXISTS data_quality_score NUMERIC(3,2) DEFAULT 1.00;
ALTER TABLE public.trails ADD COLUMN IF NOT EXISTS last_verified TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_trails_source_import ON public.trails(source, import_job_id);
CREATE INDEX IF NOT EXISTS idx_trails_coordinates ON public.trails(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_import_logs_job_source ON public.import_logs(job_id, source_name);
CREATE INDEX IF NOT EXISTS idx_trail_duplicates_original ON public.trail_duplicates(original_trail_id);

-- Enable RLS on new tables
ALTER TABLE public.import_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trail_duplicates ENABLE ROW LEVEL SECURITY;

-- Create policies for import_logs
CREATE POLICY "Public read import logs" ON public.import_logs
  FOR SELECT USING (true);

CREATE POLICY "Service role manage import logs" ON public.import_logs
  FOR ALL USING (auth.role() = 'service_role');

-- Create policies for trail_duplicates  
CREATE POLICY "Public read trail duplicates" ON public.trail_duplicates
  FOR SELECT USING (true);

CREATE POLICY "Service role manage trail duplicates" ON public.trail_duplicates
  FOR ALL USING (auth.role() = 'service_role');

-- Insert default trail data sources with proper configuration
INSERT INTO public.trail_data_sources (name, source_type, url, country, region, is_active, config) 
VALUES 
  ('Hiking Project API', 'hiking_project', 'https://www.hikingproject.com/data/get-trails', 'United States', 'North America', true, 
   '{"max_results": 500, "regions": [{"name": "Northeast", "lat": 40.7128, "lon": -74.0060}, {"name": "Colorado", "lat": 39.7392, "lon": -104.9903}, {"name": "California", "lat": 37.7749, "lon": -122.4194}]}'::jsonb),
  ('OpenStreetMap Overpass', 'openstreetmap', 'https://overpass-api.de/api/interpreter', 'Global', 'Worldwide', true,
   '{"timeout": 180, "regions": [{"name": "Colorado Rockies", "bbox": {"south": 37.0, "west": -109.0, "north": 41.0, "east": -102.0}}, {"name": "California Sierra Nevada", "bbox": {"south": 35.5, "west": -120.0, "north": 38.5, "east": -117.0}}]}'::jsonb),
  ('USGS National Map', 'usgs', 'https://www.nps.gov/api/v1', 'United States', 'North America', true,
   '{"limit": 500, "park_limit": 100}'::jsonb)
ON CONFLICT (name) DO UPDATE SET
  source_type = EXCLUDED.source_type,
  url = EXCLUDED.url,
  is_active = EXCLUDED.is_active,
  config = EXCLUDED.config;

-- Create function to validate trail data quality
CREATE OR REPLACE FUNCTION public.calculate_trail_quality_score(
  trail_name TEXT,
  trail_description TEXT,
  trail_length NUMERIC,
  trail_elevation INTEGER,
  trail_lat DOUBLE PRECISION,
  trail_lon DOUBLE PRECISION
)
RETURNS NUMERIC AS $$
DECLARE
  score NUMERIC := 1.00;
BEGIN
  -- Deduct points for missing or poor quality data
  IF trail_name IS NULL OR LENGTH(trail_name) < 3 THEN
    score := score - 0.20;
  END IF;
  
  IF trail_description IS NULL OR LENGTH(trail_description) < 10 THEN
    score := score - 0.15;
  END IF;
  
  IF trail_length IS NULL OR trail_length <= 0 THEN
    score := score - 0.25;
  END IF;
  
  IF trail_elevation IS NULL THEN
    score := score - 0.10;
  END IF;
  
  IF trail_lat IS NULL OR trail_lon IS NULL OR 
     trail_lat = 0 OR trail_lon = 0 OR
     ABS(trail_lat) > 90 OR ABS(trail_lon) > 180 THEN
    score := score - 0.30;
  END IF;
  
  -- Ensure score doesn't go below 0
  RETURN GREATEST(score, 0.00);
END;
$$ LANGUAGE plpgsql;