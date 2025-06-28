
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Service responsible for setting up and managing bulk import tables
 */
export class BulkImportService {
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
      
      // Properly handle the returned data by using type assertions
      if (data && Array.isArray(data) && data.length > 0) {
        const result = data[0] as Record<string, unknown>;
        return result.exists === true;
      }
      
      return false;
    } catch (error) {
      console.error('Exception when checking if bulk import tables exist:', error);
      return false;
    }
  }
}
