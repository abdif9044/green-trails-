-- Fix PostGIS security issues identified by Supabase linter
-- This addresses:
-- 1. Security Definer Views (geometry_columns, geography_columns)
-- 2. RLS disabled on spatial_ref_sys table

-- Enable RLS on spatial_ref_sys table (PostGIS system table)
-- This table contains spatial reference system definitions and should be readable by all
ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to spatial reference systems
-- This is safe as it's reference data that should be publicly readable
CREATE POLICY "Allow public read access to spatial reference systems" 
ON public.spatial_ref_sys 
FOR SELECT 
USING (true);

-- Note: The geometry_columns and geography_columns views are PostGIS system views
-- that use SECURITY DEFINER for proper access control to system catalogs.
-- These cannot be easily modified without breaking PostGIS functionality.
-- However, we can create our own application-specific views if needed.

-- Create application-specific geometry metadata view without SECURITY DEFINER
-- This provides the same functionality but respects current user permissions
CREATE OR REPLACE VIEW public.app_geometry_columns AS
SELECT 
  current_database() AS f_table_catalog,
  n.nspname AS f_table_schema,
  c.relname AS f_table_name,
  a.attname AS f_geometry_column,
  COALESCE(postgis_typmod_dims(a.atttypmod), 2) AS coord_dimension,
  COALESCE(NULLIF(postgis_typmod_srid(a.atttypmod), 0), 0) AS srid,
  COALESCE(NULLIF(upper(postgis_typmod_type(a.atttypmod)), 'GEOMETRY'), 'GEOMETRY') AS type
FROM pg_class c
JOIN pg_attribute a ON (a.attrelid = c.oid AND NOT a.attisdropped)
JOIN pg_namespace n ON (c.relnamespace = n.oid)
JOIN pg_type t ON (a.atttypid = t.oid)
WHERE t.typname = 'geometry'
  AND c.relkind IN ('r', 'v', 'm', 'f', 'p')
  AND n.nspname NOT LIKE 'pg_%'
  AND n.nspname != 'information_schema';

-- Create application-specific geography metadata view without SECURITY DEFINER  
CREATE OR REPLACE VIEW public.app_geography_columns AS
SELECT 
  current_database() AS f_table_catalog,
  n.nspname AS f_table_schema,
  c.relname AS f_table_name,
  a.attname AS f_geography_column,
  postgis_typmod_dims(a.atttypmod) AS coord_dimension,
  postgis_typmod_srid(a.atttypmod) AS srid,
  postgis_typmod_type(a.atttypmod) AS type
FROM pg_class c
JOIN pg_attribute a ON (a.attrelid = c.oid AND NOT a.attisdropped)
JOIN pg_namespace n ON (c.relnamespace = n.oid)  
JOIN pg_type t ON (a.atttypid = t.oid)
WHERE t.typname = 'geography'
  AND c.relkind IN ('r', 'v', 'm', 'f', 'p')
  AND n.nspname NOT LIKE 'pg_%'
  AND n.nspname != 'information_schema';

-- Grant appropriate permissions on our custom views
GRANT SELECT ON public.app_geometry_columns TO authenticated, anon;
GRANT SELECT ON public.app_geography_columns TO authenticated, anon;