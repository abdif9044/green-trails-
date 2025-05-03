
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Service responsible for setting up and initializing database structures
 * required by various application features.
 */
export class DatabaseSetupService {
  /**
   * Sets up the tables required for bulk trail imports
   * @returns Promise resolving to success status and optional error
   */
  static async setupBulkImportTables() {
    try {
      // Use the raw SQL script to create necessary tables
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
  
  /**
   * Helper function to verify if the bulk import tables exist
   * @returns Promise resolving to boolean indicating if tables exist
   */
  static async checkBulkImportTablesExist() {
    try {
      const { data, error } = await supabase.rpc('execute_sql', {
        sql_query: `
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_name = 'bulk_import_jobs'
          ) as exists;
        `
      });

      if (error) {
        console.error('Error checking if bulk import tables exist:', error);
        return false;
      }
      
      return data && data.length > 0 && data[0].exists;
    } catch (error) {
      console.error('Exception when checking if bulk import tables exist:', error);
      return false;
    }
  }
  
  /**
   * Create default strain tags for cannabis-friendly trails
   * @returns Promise resolving to success status
   */
  static async createDefaultStrainTags() {
    try {
      const defaultStrains = [
        { name: 'Sativa', details: { effects: ['energizing', 'uplifting', 'creative'] } },
        { name: 'Indica', details: { effects: ['relaxing', 'sedating', 'pain relief'] } },
        { name: 'Hybrid', details: { effects: ['balanced', 'varied effects'] } },
        { name: 'CBD', details: { effects: ['non-psychoactive', 'therapeutic'] } }
      ];
      
      // Insert default strain tags if they don't exist
      const { error } = await supabase
        .from('tags')
        .upsert(
          defaultStrains.map(strain => ({
            name: strain.name,
            tag_type: 'strain',
            details: strain.details
          })),
          { onConflict: 'name' }
        );
        
      if (error) {
        console.error('Error creating default strain tags:', error);
        return { success: false, error };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Exception when creating default strain tags:', error);
      return { success: false, error };
    }
  }
}

/**
 * Hook for using the database setup service in React components
 */
export function useDatabaseSetup() {
  const setupBulkImport = async () => {
    try {
      const result = await DatabaseSetupService.setupBulkImportTables();
      
      if (result.success) {
        toast({
          title: "Database setup complete",
          description: "Bulk import tables have been created successfully.",
        });
        
        // Create default strain tags after tables are set up
        await DatabaseSetupService.createDefaultStrainTags();
        
        return true;
      } else {
        toast({
          title: "Database setup failed",
          description: "Failed to create bulk import tables. Check console for details.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Error in database setup:', error);
      toast({
        title: "Database setup error",
        description: "An unexpected error occurred during database setup.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const checkTablesExist = async () => {
    return await DatabaseSetupService.checkBulkImportTablesExist();
  };
  
  return { 
    setupBulkImport,
    checkTablesExist
  };
}
