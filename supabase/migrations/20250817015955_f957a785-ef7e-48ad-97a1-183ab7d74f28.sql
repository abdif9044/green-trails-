-- Enable Row Level Security on application tables only
-- This fixes the security linter warning about RLS being disabled
-- Excludes views and PostGIS system tables

-- Enable RLS on application tables (excluding views and system tables)
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

-- Note: The following are excluded from RLS:
-- - v_trail_preview (view - views don't support RLS)
-- - app_geometry_metadata (appears to be a metadata table)
-- - PostGIS system tables (geometry_columns, geography_columns, spatial_ref_sys)
--   These are managed by PostGIS extension and need public access