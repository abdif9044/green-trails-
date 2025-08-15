-- Address PostGIS security linter warnings with safe alternatives
-- Note: PostGIS system objects (spatial_ref_sys, geometry_columns, geography_columns) 
-- cannot be modified as they are managed by the PostGIS extension

-- Create application-specific metadata views that don't use SECURITY DEFINER
-- These provide similar functionality while respecting current user permissions

CREATE OR REPLACE VIEW public.app_geometry_metadata AS
SELECT 
  'public'::text AS schema_name,
  t.relname AS table_name,
  a.attname AS geometry_column,
  'geometry'::text AS column_type
FROM pg_class t
JOIN pg_attribute a ON (a.attrelid = t.oid AND NOT a.attisdropped)
JOIN pg_type typ ON (a.atttypid = typ.oid)
WHERE typ.typname = 'geometry'
  AND t.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  AND t.relkind = 'r'
  AND has_table_privilege(t.oid, 'SELECT');

-- Grant read access to authenticated users and anon
GRANT SELECT ON public.app_geometry_metadata TO authenticated, anon;

-- Document PostGIS system objects that trigger linter warnings but cannot be modified:
-- 1. spatial_ref_sys table: PostGIS-managed reference data, RLS cannot be enabled
-- 2. geometry_columns view: PostGIS system view with SECURITY DEFINER (required for function)  
-- 3. geography_columns view: PostGIS system view with SECURITY DEFINER (required for function)
-- These are standard PostGIS objects and the security warnings are expected behavior.