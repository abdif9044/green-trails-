
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
      // Since we can't use execute_sql, we'll check if tables exist via metadata
      const { data: tableCheck, error: checkError } = await supabase
        .from('bulk_import_jobs')
        .select('id')
        .limit(1);

      // If no error, table exists
      if (!checkError) {
        console.log('Bulk import tables already exist');
        return { success: true };
      }

      // Table doesn't exist, we need to create it
      console.log('Bulk import tables need to be created');
      return { success: false, error: 'Tables need to be created via SQL migration' };
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
      const { error } = await supabase
        .from('bulk_import_jobs')
        .select('id')
        .limit(1);
      
      return !error;
    } catch (error) {
      console.error('Exception when checking if bulk import tables exist:', error);
      return false;
    }
  }
}
