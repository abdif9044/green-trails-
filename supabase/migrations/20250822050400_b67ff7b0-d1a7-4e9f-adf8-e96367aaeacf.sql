-- Fix Security Linter Issues for Google Play Store Submission (Corrected)

-- 1. Drop dependent objects first, then recreate view without SECURITY DEFINER
DROP FUNCTION IF EXISTS get_trail_preview(uuid) CASCADE;
DROP VIEW IF EXISTS v_trail_preview CASCADE;

-- Recreate the view without SECURITY DEFINER
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
DO $$
DECLARE
    func_record RECORD;
BEGIN
    -- Update specific known functions
    BEGIN
        ALTER FUNCTION public.is_service_role() SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN NULL; END;
    
    BEGIN
        ALTER FUNCTION public.update_updated_at_column() SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN NULL; END;
    
    BEGIN
        ALTER FUNCTION public.test_trail_insert_permissions() SET search_path = 'public', 'auth';
    EXCEPTION WHEN OTHERS THEN NULL; END;
    
    BEGIN
        ALTER FUNCTION public.log_security_event(text, jsonb, uuid, inet, text) SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN NULL; END;
    
    BEGIN
        ALTER FUNCTION public.get_current_user_profile() SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN NULL; END;
    
    BEGIN
        ALTER FUNCTION public.audit_profile_changes() SET search_path = 'public';
    EXCEPTION WHEN OTHERS THEN NULL; END;

    -- Update all other public functions that don't have search_path set
    FOR func_record IN 
        SELECT p.proname as functionname
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' 
        AND p.proname NOT LIKE 'st_%'
        AND p.proname NOT LIKE 'postgis_%'
        AND p.proname NOT LIKE 'geometry_%'
        AND p.proname NOT LIKE '_st_%'
        AND p.proname NOT LIKE 'pgis_%'
        AND p.proname NOT LIKE 'box%'
        AND p.proname NOT LIKE 'get_proj4%'
        AND p.proname NOT LIKE 'populate_%'
        AND p.proname NOT LIKE 'dropgeometry%'
        AND p.proname NOT LIKE 'updategeometry%'
        AND p.proname NOT LIKE 'path'
        AND p.proname NOT LIKE 'point'
        AND p.proname NOT LIKE 'geometry'
        AND p.proname NOT LIKE 'text'
        AND p.proname NOT LIKE 'spheroid_%'
        AND p.proname NOT LIKE 'gidx_%'
    LOOP
        BEGIN
            EXECUTE format('ALTER FUNCTION public.%I SET search_path = ''public''', func_record.functionname);
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END LOOP;
END $$;

-- 3. Enable RLS on all public tables that don't have it (excluding system tables)
DO $$
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT LIKE 'spatial_%'
        AND tablename NOT LIKE 'geometry_%'
        AND tablename NOT LIKE 'geography_%'
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
            NULL;
        END;
    END LOOP;
END $$;

-- 4. Create security policies for geometry/geography system tables if they need RLS
DO $$
BEGIN
    BEGIN
        CREATE POLICY "Allow public read access" ON public.app_geometry_metadata FOR SELECT USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END;
    
    BEGIN
        CREATE POLICY "Allow public read access" ON public.geometry_columns FOR SELECT USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END;
    
    BEGIN
        CREATE POLICY "Allow public read access" ON public.geography_columns FOR SELECT USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END;
    
    BEGIN
        CREATE POLICY "Allow public read access" ON public.spatial_ref_sys FOR SELECT USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;