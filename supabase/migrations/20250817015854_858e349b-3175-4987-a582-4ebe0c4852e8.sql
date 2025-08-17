-- Enable Row Level Security on application tables only
-- This fixes the security linter warning about RLS being disabled
-- Excludes PostGIS system tables and other extension-managed tables

DO $$
DECLARE
    table_record RECORD;
BEGIN
    -- Enable RLS on all application tables in public schema that don't have it enabled
    -- Exclude PostGIS system tables and other extension-managed tables
    FOR table_record IN 
        SELECT schemaname, tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
        AND tablename NOT IN (
            -- Exclude PostGIS system tables
            'spatial_ref_sys', 'geometry_columns', 'geography_columns',
            -- Exclude any tables that already have RLS enabled
            SELECT tablename 
            FROM pg_tables t
            JOIN pg_class c ON c.relname = t.tablename
            WHERE t.schemaname = 'public' 
            AND c.relrowsecurity = true
        )
    LOOP
        BEGIN
            EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', 
                          table_record.schemaname, table_record.tablename);
            RAISE NOTICE 'Enabled RLS on table: %.%', table_record.schemaname, table_record.tablename;
        EXCEPTION
            WHEN insufficient_privilege THEN
                RAISE NOTICE 'Skipped table %.% (insufficient privileges)', table_record.schemaname, table_record.tablename;
            WHEN OTHERS THEN
                RAISE NOTICE 'Error enabling RLS on table %.%: %', table_record.schemaname, table_record.tablename, SQLERRM;
        END;
    END LOOP;
END
$$;

-- Specifically ensure RLS is enabled on all application tables
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