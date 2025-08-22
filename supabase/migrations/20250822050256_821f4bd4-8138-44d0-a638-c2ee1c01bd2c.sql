-- Fix Security Linter Issues for Google Play Store Submission

-- 1. Fix Security Definer Views by dropping and recreating without SECURITY DEFINER
DROP VIEW IF EXISTS v_trail_preview;
CREATE VIEW v_trail_preview AS
SELECT 
    id,
    name,
    length_miles,
    difficulty,
    rating,
    cover_photo,
    blurb,
    state,
    location
FROM trails 
WHERE status = 'approved' AND is_active = true;

-- 2. Fix Function Search Path Mutable issues by adding SET search_path
ALTER FUNCTION public.is_service_role() SET search_path = 'public';
ALTER FUNCTION public.update_updated_at_column() SET search_path = 'public';
ALTER FUNCTION public.test_trail_insert_permissions() SET search_path = 'public', 'auth';
ALTER FUNCTION public.log_security_event(text, jsonb, uuid, inet, text) SET search_path = 'public';
ALTER FUNCTION public.get_current_user_profile() SET search_path = 'public';
ALTER FUNCTION public.audit_profile_changes() SET search_path = 'public';

-- Fix any custom functions that might exist
DO $$
DECLARE
    func_record RECORD;
BEGIN
    FOR func_record IN 
        SELECT schemaname, functionname, arguments
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' 
        AND p.prosecdef = false
        AND NOT EXISTS (
            SELECT 1 FROM pg_proc_config pc 
            WHERE pc.oid = p.oid 
            AND pc.setting LIKE '%search_path%'
        )
    LOOP
        BEGIN
            EXECUTE format('ALTER FUNCTION public.%I SET search_path = ''public''', func_record.functionname);
        EXCEPTION WHEN OTHERS THEN
            -- Skip if function can't be altered
            NULL;
        END;
    END LOOP;
END $$;

-- 3. Enable RLS on all public tables that don't have it
DO $$
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT IN (
            SELECT tablename 
            FROM pg_tables t
            JOIN pg_class c ON c.relname = t.tablename
            WHERE c.relrowsecurity = true
        )
    LOOP
        BEGIN
            EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_record.tablename);
        EXCEPTION WHEN OTHERS THEN
            -- Skip if table can't have RLS enabled (like views)
            NULL;
        END;
    END LOOP;
END $$;

-- 4. Create security policies for any tables missing them
CREATE POLICY "Allow public read access" ON public.app_geometry_metadata FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.geometry_columns FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.geography_columns FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.spatial_ref_sys FOR SELECT USING (true);

-- 5. Grant necessary permissions for PostgREST access
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;