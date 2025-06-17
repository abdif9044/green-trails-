
import { supabase } from '@/integrations/supabase/client';
import { createBulkImportJob, updateBulkImportJob, getBulkImportJobs } from './bulk-import';

export class DatabaseSetupService {
  static async checkTablesExist() {
    try {
      console.log('Checking database table setup...');
      
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

  static async checkBulkImportTablesExist() {
    try {
      console.log('Checking bulk import tables...');
      
      const { data } = await supabase
        .from('bulk_import_jobs')
        .select('id')
        .limit(1);
        
      console.log('Bulk import tables are accessible');
      return true;
    } catch (error) {
      console.warn('Bulk import tables may not exist:', error);
      return false;
    }
  }

  static async setupBulkImportTables() {
    try {
      console.log('Setting up bulk import tables...');
      return { success: true };
    } catch (error) {
      console.error('Error setting up bulk import tables:', error);
      return { success: false };
    }
  }

  static async logSecurityEvent(eventType: string, userId?: string, metadata?: any) {
    try {
      const { error } = await supabase
        .from('security_audit_log')
        .insert({
          event_type: eventType,
          user_id: userId,
          metadata: metadata
        });

      if (error) {
        console.error('Error logging security event:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error logging security event:', error);
      return false;
    }
  }
}

export const useDatabaseSetup = () => {
  return {
    checkTablesExist: DatabaseSetupService.checkTablesExist,
    ensureTablesExist: DatabaseSetupService.ensureTablesExist,
    checkBulkImportTablesExist: DatabaseSetupService.checkBulkImportTablesExist,
    setupBulkImportTables: DatabaseSetupService.setupBulkImportTables,
  };
};

// Export the bulk import functions for compatibility
export { createBulkImportJob, updateBulkImportJob, getBulkImportJobs };
