-- Enable Row Level Security on all application tables
-- This fixes the security linter warning about RLS being disabled
-- Only targets application tables, not PostGIS system tables

-- Enable RLS on all application tables
-- Using IF EXISTS to avoid errors for tables that don't exist
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.trails ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.trail_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.trail_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.trail_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.saved_trails ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.trail_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.trail_waypoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.hike_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.hiking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.community_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.trail_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.log_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.trail_weather ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.trail_weather_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.parking_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.trail_3d_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.bulk_import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.trail_import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.import_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.trail_duplicates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.security_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.product_variations ENABLE ROW LEVEL SECURITY;

-- Enable RLS on additional tables that might exist
ALTER TABLE IF EXISTS public.v_trail_preview ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.app_geometry_metadata ENABLE ROW LEVEL SECURITY;

-- Note: PostGIS system tables (geometry_columns, geography_columns, spatial_ref_sys) 
-- are managed by the PostGIS extension and should not have RLS enabled as they
-- contain reference data that needs to be publicly accessible for the extension to work