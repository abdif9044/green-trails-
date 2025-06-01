
-- Fix bulk_import_jobs table to include missing config column
-- This resolves the "Could not find the 'config' column" error

-- Add missing config column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'bulk_import_jobs' AND column_name = 'config') THEN
    ALTER TABLE public.bulk_import_jobs ADD COLUMN config JSONB;
    RAISE NOTICE 'Added config column to bulk_import_jobs table';
  END IF;
END $$;

-- Add missing results column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'bulk_import_jobs' AND column_name = 'results') THEN
    ALTER TABLE public.bulk_import_jobs ADD COLUMN results JSONB;
    RAISE NOTICE 'Added results column to bulk_import_jobs table';
  END IF;
END $$;

-- Ensure proper indexes exist for performance
CREATE INDEX IF NOT EXISTS idx_bulk_import_jobs_status ON public.bulk_import_jobs(status);
CREATE INDEX IF NOT EXISTS idx_bulk_import_jobs_started_at ON public.bulk_import_jobs(started_at);

-- Grant proper permissions to service role
GRANT ALL ON public.bulk_import_jobs TO service_role;

-- Test the table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'bulk_import_jobs' 
ORDER BY ordinal_position;
