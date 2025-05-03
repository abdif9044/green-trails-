
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export async function setupBulkImportTables() {
  const { toast } = useToast();
  
  try {
    // Use the raw SQL script from the SQL file
    const { error } = await supabase.rpc('execute_sql', { 
      sql_query: `
        -- Create bulk_import_jobs table to track large-scale imports
        CREATE TABLE IF NOT EXISTS bulk_import_jobs (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          status TEXT NOT NULL CHECK (status IN ('queued', 'processing', 'completed', 'error')),
          started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          completed_at TIMESTAMPTZ,
          total_trails_requested INTEGER NOT NULL,
          total_sources INTEGER NOT NULL,
          trails_processed INTEGER DEFAULT 0,
          trails_added INTEGER DEFAULT 0,
          trails_updated INTEGER DEFAULT 0,
          trails_failed INTEGER DEFAULT 0,
          last_updated TIMESTAMPTZ DEFAULT now()
        );

        -- Add bulk_job_id to trail_import_jobs to track which individual jobs belong to a bulk operation
        ALTER TABLE trail_import_jobs
        ADD COLUMN IF NOT EXISTS bulk_job_id UUID REFERENCES bulk_import_jobs(id);

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_bulk_import_jobs_status ON bulk_import_jobs(status);
        CREATE INDEX IF NOT EXISTS idx_trail_import_jobs_bulk_job_id ON trail_import_jobs(bulk_job_id);

        -- Add tags table if it doesn't exist (for regular and strain tags)
        CREATE TABLE IF NOT EXISTS tags (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL UNIQUE,
          tag_type TEXT NOT NULL DEFAULT 'regular',
          details JSONB,
          created_at TIMESTAMPTZ DEFAULT now()
        );

        -- Add trail_tags junction table if it doesn't exist
        CREATE TABLE IF NOT EXISTS trail_tags (
          trail_id UUID REFERENCES trails(id) ON DELETE CASCADE,
          tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
          is_strain_tag BOOLEAN DEFAULT false,
          PRIMARY KEY (trail_id, tag_id)
        );

        -- Add index for faster tag queries
        CREATE INDEX IF NOT EXISTS idx_trail_tags_trail_id ON trail_tags(trail_id);
        CREATE INDEX IF NOT EXISTS idx_trail_tags_tag_id ON trail_tags(tag_id);
        CREATE INDEX IF NOT EXISTS idx_trail_tags_is_strain ON trail_tags(is_strain_tag);
      `
    });

    if (error) {
      console.error('Error setting up bulk import tables:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Exception when setting up bulk import tables:', error);
    return { success: false, error };
  }
}

export function useSetupBulkImport() {
  const { toast } = useToast();
  
  const runSetup = async () => {
    const result = await setupBulkImportTables();
    
    if (result.success) {
      toast({
        title: "Database setup complete",
        description: "Bulk import tables have been created successfully.",
      });
      return true;
    } else {
      toast({
        title: "Database setup failed",
        description: "Failed to create bulk import tables. Check console for details.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  return { runSetup };
}
