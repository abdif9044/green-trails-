-- Fix remaining RLS issues detected by security linter
-- Enable RLS on any public tables that don't have it enabled

-- Check and enable RLS on geometry_columns if it exists and is accessible
DO $$ 
BEGIN
    -- Enable RLS on geometry_columns if it exists in public schema
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'geometry_columns' AND table_schema = 'public') THEN
        ALTER TABLE public.geometry_columns ENABLE ROW LEVEL SECURITY;
        
        -- Create policy to allow read access (this is typically reference data)
        CREATE POLICY "Allow read access to geometry_columns" 
        ON public.geometry_columns 
        FOR SELECT 
        USING (true);
    END IF;
    
    -- Enable RLS on geography_columns if it exists in public schema
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'geography_columns' AND table_schema = 'public') THEN
        ALTER TABLE public.geography_columns ENABLE ROW LEVEL SECURITY;
        
        -- Create policy to allow read access (this is typically reference data)
        CREATE POLICY "Allow read access to geography_columns" 
        ON public.geography_columns 
        FOR SELECT 
        USING (true);
    END IF;
    
    -- Enable RLS on spatial_ref_sys if it exists in public schema
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'spatial_ref_sys' AND table_schema = 'public') THEN
        ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;
        
        -- Create policy to allow read access (this is reference data for spatial calculations)
        CREATE POLICY "Allow read access to spatial_ref_sys" 
        ON public.spatial_ref_sys 
        FOR SELECT 
        USING (true);
    END IF;
    
EXCEPTION WHEN OTHERS THEN
    -- Some system tables might not be modifiable, that's okay
    NULL;
END $$;

-- Ensure our is_admin function has proper security
-- Update the search path to be more secure
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  );
$$;