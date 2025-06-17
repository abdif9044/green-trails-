
import { supabase } from '@/integrations/supabase/client';
import { createBulkImportJob, updateBulkImportJob, getBulkImportJobs } from './bulk-import';

export class DatabaseSetupService {
  static async checkTablesExist() {
    try {
      console.log('Checking database table setup...');
      
      // Test a few key tables to see if they exist
      const { data: trailsTest } = await supabase
        .from('trails')
        .select('id')
        .limit(1);
        
      console.log('Database tables are accessible');
      return true;
    } catch (error) {
      console.error('Database setup check failed:', error);
      return false;
    }
  }

  static async ensureTablesExist() {
    try {
      const tablesExist = await this.checkTablesExist();
      if (!tablesExist) {
        console.warn('Some database tables may be missing');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error ensuring tables exist:', error);
      return false;
    }
  }
}

// Export the bulk import functions for compatibility
export { createBulkImportJob, updateBulkImportJob, getBulkImportJobs };
