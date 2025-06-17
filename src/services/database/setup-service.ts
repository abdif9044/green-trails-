
import { supabase } from '@/integrations/supabase/client';

export class DatabaseSetupService {
  static async checkBulkImportTablesExist(): Promise<boolean> {
    try {
      // Check if bulk_import_jobs table exists
      const { error } = await supabase
        .from('bulk_import_jobs')
        .select('id')
        .limit(1);
        
      return !error;
    } catch (error) {
      return false;
    }
  }

  static async setupBulkImportTables(): Promise<{ success: boolean; error?: string }> {
    try {
      // The tables should already exist from the SQL migration
      // This is a fallback check
      const tablesExist = await this.checkBulkImportTablesExist();
      
      if (tablesExist) {
        return { success: true };
      } else {
        return { 
          success: false, 
          error: 'Bulk import tables do not exist. Please run the SQL migration first.' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  static async getCurrentTrailCount(): Promise<number> {
    try {
      const { count } = await supabase
        .from('trails')
        .select('*', { count: 'exact', head: true });
      
      return count || 0;
    } catch (error) {
      console.error('Error getting trail count:', error);
      return 0;
    }
  }

  static async getImportStatus(): Promise<{
    isActive: boolean;
    currentCount: number;
    lastImportJob?: any;
  }> {
    try {
      const currentCount = await this.getCurrentTrailCount();
      
      const { data: activeJobs } = await supabase
        .from('bulk_import_jobs')
        .select('*')
        .eq('status', 'processing')
        .order('started_at', { ascending: false })
        .limit(1);

      const { data: lastJob } = await supabase
        .from('bulk_import_jobs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(1);

      return {
        isActive: activeJobs && activeJobs.length > 0,
        currentCount,
        lastImportJob: lastJob?.[0] || null
      };
    } catch (error) {
      console.error('Error getting import status:', error);
      return {
        isActive: false,
        currentCount: 0
      };
    }
  }
}

// Hook for easy access to database setup functionality
export const useDatabaseSetup = () => {
  return {
    checkBulkImportTablesExist: DatabaseSetupService.checkBulkImportTablesExist,
    setupBulkImportTables: DatabaseSetupService.setupBulkImportTables,
    getCurrentTrailCount: DatabaseSetupService.getCurrentTrailCount,
    getImportStatus: DatabaseSetupService.getImportStatus
  };
};
