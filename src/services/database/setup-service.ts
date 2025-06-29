
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

  static async logSecurityEvent(eventType: string, data: any) {
    try {
      // Mock implementation since security_audit_log table doesn't exist
      console.log('Security event logged:', { eventType, data, timestamp: new Date().toISOString() });
      return { success: true };
    } catch (error) {
      console.error('Error logging security event:', error);
      return { success: false, error };
    }
  }

  static async ensureMediaBucketExists() {
    try {
      // Check if media bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const mediaBucket = buckets?.find(bucket => bucket.name === 'media');
      
      if (!mediaBucket) {
        // Create media bucket
        const { error } = await supabase.storage.createBucket('media', {
          public: true,
          allowedMimeTypes: ['image/*', 'video/*']
        });
        
        if (error) {
          console.error('Error creating media bucket:', error);
          return { success: false, error };
        }
        
        console.log('Media bucket created successfully');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error ensuring media bucket exists:', error);
      return { success: false, error };
    }
  }
}
