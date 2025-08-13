-- Fix critical security issue: Restrict access to trail_data_sources table
-- This table contains sensitive API keys and database credentials that should only be accessible to admins

-- First, ensure RLS is enabled on the trail_data_sources table if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'trail_data_sources' AND table_schema = 'public') THEN
        ALTER TABLE public.trail_data_sources ENABLE ROW LEVEL SECURITY;
        
        -- Drop any existing permissive policies that might allow public access
        DROP POLICY IF EXISTS "Anyone can view trail data sources" ON public.trail_data_sources;
        DROP POLICY IF EXISTS "Public read trail data sources" ON public.trail_data_sources;
        DROP POLICY IF EXISTS "Trail data sources are publicly readable" ON public.trail_data_sources;
        
        -- Create admin-only access policies for trail_data_sources
        CREATE POLICY "Only admins can view trail data sources" 
        ON public.trail_data_sources 
        FOR SELECT 
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
          )
        );

        CREATE POLICY "Only admins can insert trail data sources" 
        ON public.trail_data_sources 
        FOR INSERT 
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
          )
        );

        CREATE POLICY "Only admins can update trail data sources" 
        ON public.trail_data_sources 
        FOR UPDATE 
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
          )
        );

        CREATE POLICY "Only admins can delete trail data sources" 
        ON public.trail_data_sources 
        FOR DELETE 
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
          )
        );
    END IF;
END $$;

-- Also fix the bulk_import_jobs table mentioned in other security findings
-- Drop overly permissive policies on bulk_import_jobs
DROP POLICY IF EXISTS "Anyone can view import jobs" ON public.bulk_import_jobs;

-- Create more restrictive policy for bulk_import_jobs
CREATE POLICY "Only admins can view bulk import jobs" 
ON public.bulk_import_jobs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- Create helper function to check if user is admin (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  );
$$;

-- Update existing policies to use the helper function instead of direct queries
-- This prevents potential RLS recursion issues
DROP POLICY IF EXISTS "Admins can manage trails" ON public.trails;
CREATE POLICY "Admins can manage trails" 
ON public.trails 
FOR ALL 
USING (is_admin());

DROP POLICY IF EXISTS "Admins can delete reviews" ON public.trail_reviews;
CREATE POLICY "Admins can delete reviews" 
ON public.trail_reviews 
FOR DELETE 
USING (is_admin());

DROP POLICY IF EXISTS "Admins can manage trail waypoints" ON public.trail_waypoints;
CREATE POLICY "Admins can manage trail waypoints" 
ON public.trail_waypoints 
FOR ALL 
USING (is_admin());

DROP POLICY IF EXISTS "Admins can manage trail 3d models" ON public.trail_3d_models;
CREATE POLICY "Admins can manage trail 3d models" 
ON public.trail_3d_models 
FOR ALL 
USING (is_admin());