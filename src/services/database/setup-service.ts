
import { supabase } from '@/integrations/supabase/client';
import { BulkImportService } from './bulk-import';

export class DatabaseSetupService {
  static async setupBulkImportTables() {
    return BulkImportService.setupBulkImportTables();
  }

  static async checkBulkImportTablesExist() {
    return BulkImportService.checkBulkImportTablesExist();
  }

  static async checkSecurityAuditLogExists() {
    try {
      // Since security_audit_log table doesn't exist in current schema,
      // we'll return false to indicate it needs to be created
      console.log('Security audit log table check - table does not exist in current schema');
      return false;
    } catch (error) {
      console.error('Error checking security audit log table:', error);
      return false;
    }
  }
}
