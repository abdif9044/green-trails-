-- Fix RLS policies for import system
-- Drop existing policies first, then recreate them

-- Fix bulk_import_jobs policies
DROP POLICY IF EXISTS "Allow bulk import job creation" ON public.bulk_import_jobs;
DROP POLICY IF EXISTS "Allow bulk import job reads" ON public.bulk_import_jobs;
DROP POLICY IF EXISTS "Allow bulk import job updates" ON public.bulk_import_jobs;

CREATE POLICY "Allow bulk import job creation" ON public.bulk_import_jobs
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow bulk import job reads" ON public.bulk_import_jobs
FOR SELECT 
USING (true);

CREATE POLICY "Allow bulk import job updates" ON public.bulk_import_jobs
FOR UPDATE 
USING (true);

-- Fix trail_import_jobs policies
DROP POLICY IF EXISTS "Allow trail import job creation" ON public.trail_import_jobs;
DROP POLICY IF EXISTS "Allow trail import job reads" ON public.trail_import_jobs;
DROP POLICY IF EXISTS "Allow trail import job updates" ON public.trail_import_jobs;

CREATE POLICY "Allow trail import job creation" ON public.trail_import_jobs
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow trail import job reads" ON public.trail_import_jobs
FOR SELECT 
USING (true);

CREATE POLICY "Allow trail import job updates" ON public.trail_import_jobs
FOR UPDATE 
USING (true);

-- Grant execute permissions on the bulk insert function
GRANT EXECUTE ON FUNCTION public.bulk_insert_trails(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.bulk_insert_trails(JSONB) TO anon;