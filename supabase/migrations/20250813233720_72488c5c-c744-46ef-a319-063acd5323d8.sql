-- Fix critical security issue: Restrict access to trail_data_sources table
-- This table contains sensitive API keys and database credentials that should only be accessible to admins

-- First, ensure RLS is enabled on the trail_data_sources table
ALTER TABLE IF EXISTS public.trail_data_sources ENABLE ROW LEVEL SECURITY;

-- Drop any existing permissive policies that might allow public access
DROP POLICY IF EXISTS "Anyone can view trail data sources" ON public.trail_data_sources;
DROP POLICY IF EXISTS "Public read trail data sources" ON public.trail_data_sources;
DROP POLICY IF EXISTS "Trail data sources are publicly readable" ON public.trail_data_sources;

-- Create admin-only access policies for trail_data_sources
-- Only admins can view the sensitive data
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

-- Only admins can insert new data sources
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

-- Only admins can update existing data sources
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

-- Only admins can delete data sources
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

-- Also fix the bulk_import_jobs table mentioned in other security findings
-- This table contains internal system configuration that should be admin-only

-- Drop overly permissive policies on bulk_import_jobs
UPDATE pg_policies SET permissive = 'RESTRICTIVE' 
WHERE tablename = 'bulk_import_jobs' AND policyname LIKE '%public%' OR policyname LIKE '%anyone%';

-- Create more restrictive policies for bulk_import_jobs
DROP POLICY IF EXISTS "Anyone can view import jobs" ON public.bulk_import_jobs;
DROP POLICY IF EXISTS "Allow bulk import job reads" ON public.bulk_import_jobs;

-- Only admins should view detailed job information
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

-- Keep the insert/update policies for system operations but make them more restrictive
DROP POLICY IF EXISTS "Allow bulk import job creation" ON public.bulk_import_jobs;
DROP POLICY IF EXISTS "Allow bulk import job updates" ON public.bulk_import_jobs;

-- Only allow service role and admins to create/update import jobs
CREATE POLICY "Admins and service can create import jobs" 
ON public.bulk_import_jobs 
FOR INSERT 
WITH CHECK (
  auth.role() = 'service_role' OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Admins and service can update import jobs" 
ON public.bulk_import_jobs 
FOR UPDATE 
USING (
  auth.role() = 'service_role' OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);