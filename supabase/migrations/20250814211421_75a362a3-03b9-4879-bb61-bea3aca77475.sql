-- Fix security linter issues

-- Fix RLS on any tables that don't have it enabled
DO $$
DECLARE
    rec RECORD;
BEGIN
    -- Enable RLS on any public tables that don't have it
    FOR rec IN 
        SELECT schemaname, tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT IN (
            SELECT tablename 
            FROM pg_tables t
            JOIN pg_class c ON c.relname = t.tablename
            WHERE c.relrowsecurity = true
            AND t.schemaname = 'public'
        )
        AND tablename NOT IN ('spatial_ref_sys', 'geometry_columns', 'geography_columns') -- Skip PostGIS system tables
    LOOP
        EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', rec.schemaname, rec.tablename);
        RAISE NOTICE 'Enabled RLS on %.%', rec.schemaname, rec.tablename;
    END LOOP;
END $$;

-- Fix function search paths by updating key functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
STABLE
SET search_path = public;

-- Update test trail insert permissions function
CREATE OR REPLACE FUNCTION public.test_trail_insert_permissions()
RETURNS TABLE(
    can_insert boolean,
    current_role text,
    auth_uid uuid,
    is_service_role boolean
) AS $$
BEGIN
    RETURN QUERY SELECT 
        true as can_insert,
        current_setting('role') as current_role,
        auth.uid() as auth_uid,
        public.is_service_role() as is_service_role;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, auth;

-- Update is_service_role function with proper search path
CREATE OR REPLACE FUNCTION public.is_service_role()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN current_setting('role', true) = 'service_role';
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
STABLE
SET search_path = public;