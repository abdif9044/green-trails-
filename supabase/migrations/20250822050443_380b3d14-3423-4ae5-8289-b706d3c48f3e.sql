-- Fix Security Linter Issues for Google Play Store Submission (Final)

-- 1. Drop dependent objects first, then recreate view without SECURITY DEFINER
DROP FUNCTION IF EXISTS get_trail_preview(uuid) CASCADE;
DROP VIEW IF EXISTS v_trail_preview CASCADE;

-- Recreate the view without SECURITY DEFINER using correct column names
CREATE VIEW v_trail_preview AS
SELECT 
    id,
    name,
    length_miles,
    difficulty,
    rating,
    CASE 
        WHEN photos IS NOT NULL AND array_length(photos, 1) > 0 
        THEN photos[1] 
        ELSE NULL 
    END AS cover_photo,
    description AS blurb,
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

    -- Update custom functions only (avoid PostGIS functions)
    FOR func_record IN 
        SELECT p.proname as functionname
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' 
        AND p.proname IN ('is_admin', 'handle_new_user', 'ensure_profiles_table_structure')
    LOOP
        BEGIN
            EXECUTE format('ALTER FUNCTION public.%I SET search_path = ''public''', func_record.functionname);
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END LOOP;
END $$;

-- 3. Enable RLS on all application tables that don't have it (excluding PostGIS system tables)
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
        AND tablename NOT LIKE 'app_geometry_%'
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