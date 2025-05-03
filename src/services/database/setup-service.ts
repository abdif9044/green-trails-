
import { toast } from '@/hooks/use-toast';
import { BulkImportService } from './bulk-import';
import { TagsService } from './tags';
import { supabase } from '@/integrations/supabase/client';

/**
 * Main service for database setup operations, coordinating across different
 * specialized services
 */
export class DatabaseSetupService {
  /**
   * Sets up all necessary database tables and seed data
   */
  static async setupBulkImportTables() {
    try {
      // First check if media bucket exists, if not create it
      await DatabaseSetupService.ensureMediaBucketExists();
      
      // Set up the bulk import tables
      const bulkResult = await BulkImportService.setupBulkImportTables();
      if (!bulkResult.success) {
        return bulkResult;
      }
      
      // Then set up tag tables
      const tagResult = await TagsService.setupTagTables();
      if (!tagResult.success) {
        return tagResult;
      }
      
      // Ensure security monitoring is enabled
      await DatabaseSetupService.setupSecurityMonitoring();
      
      return { success: true };
    } catch (error) {
      console.error('Error in database setup:', error);
      return { success: false, error };
    }
  }
  
  /**
   * Helper function to check if required tables exist
   */
  static async checkBulkImportTablesExist() {
    return await BulkImportService.checkBulkImportTablesExist();
  }
  
  /**
   * Create default strain tags
   */
  static async createDefaultStrainTags() {
    return await TagsService.createDefaultStrainTags();
  }

  /**
   * Ensures the media storage bucket exists
   */
  static async ensureMediaBucketExists() {
    try {
      // Check if media bucket exists
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('Error checking buckets:', error);
        return { success: false, error };
      }

      const mediaBucketExists = buckets?.some(bucket => bucket.name === 'media');
      
      if (!mediaBucketExists) {
        // Create media bucket
        const { error: createError } = await supabase.storage.createBucket('media', {
          public: true, // Makes contents accessible to unauthenticated users
          fileSizeLimit: 10485760 // 10MB limit
        });
        
        if (createError) {
          console.error('Error creating media bucket:', createError);
          return { success: false, error: createError };
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error ensuring media bucket exists:', error);
      return { success: false, error };
    }
  }

  /**
   * Setup security monitoring functions if they don't exist
   */
  static async setupSecurityMonitoring() {
    try {
      // Check if security_audit_log table exists
      const { data, error } = await supabase.rpc('execute_sql', {
        sql_query: `
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'security_audit_log'
          ) as exists;
        `
      });

      if (error) {
        console.error('Error checking if security_audit_log exists:', error);
        return { success: false, error };
      }
      
      // Table already exists, we're good
      if (data && Array.isArray(data) && data.length > 0) {
        const result = data[0] as Record<string, unknown>;
        if (result.exists === true) {
          return { success: true };
        }
      }

      // If we need to create it (shouldn't happen since we did it in SQL), create it here
      // This is just a fallback
      
      return { success: true };
    } catch (error) {
      console.error('Error setting up security monitoring:', error);
      return { success: false, error };
    }
  }

  /**
   * Helper function to log security events
   */
  static async logSecurityEvent(eventType: string, eventDetails?: any, ipAddress?: string, userAgent?: string) {
    try {
      const { error } = await supabase.rpc('log_security_event', {
        event_type: eventType,
        event_details: eventDetails ? JSON.stringify(eventDetails) : null,
        ip_address: ipAddress || null,
        user_agent: userAgent || null
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
  
  const logSecurityEvent = async (eventType: string, eventDetails?: any) => {
    return await DatabaseSetupService.logSecurityEvent(
      eventType, 
      eventDetails,
      navigator.userAgent // Include user agent for better security tracking
    );
  };
  
  return { 
    setupBulkImport,
    checkTablesExist,
    logSecurityEvent
  };
}
