import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { BulkImportService } from './bulk-import';

/**
 * Service responsible for database setup and verification
 */
export class DatabaseSetupService {
  /**
   * Log security-related events
   */
  static async logSecurityEvent(eventType: string, metadata: any) {
    try {
      const { error } = await supabase
        .from('security_audit_log')
        .insert([{
          event_type: eventType,
          metadata,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error logging security event:', error);
      return { success: false, error };
    }
  }

  /**
   * Ensure media bucket exists
   */
  static async ensureMediaBucketExists() {
    try {
      const { data: bucket, error } = await supabase
        .storage
        .getBucket('media');

      if (error && error.message.includes('not found')) {
        const { error: createError } = await supabase
          .storage
          .createBucket('media', {
            public: false,
            allowedMimeTypes: ['image/*', 'video/*'],
            fileSizeLimit: 52428800 // 50MB
          });

        if (createError) throw createError;
      } else if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error ensuring media bucket exists:', error);
      return { success: false, error };
    }
  }

  /**
   * Check if the bulk import tables exist in the database
   * @returns Promise resolving to boolean indicating if tables exist
   */
  static async checkBulkImportTablesExist() {
    try {
      // Try to query the bulk_import_jobs table to see if it exists
      const { count, error } = await supabase
        .from('bulk_import_jobs')
        .select('*', { count: 'exact', head: true });
        
      if (error && error.code === '42P01') {
        // Table doesn't exist - PGRST error "relation does not exist"
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking if bulk import tables exist:', error);
      return false;
    }
  }
  
  /**
   * Setup bulk import tables in the database
   * @returns Promise resolving to success status and optional error
   */
  static async setupBulkImportTables() {
    try {
      return await BulkImportService.setupBulkImportTables();
    } catch (error) {
      console.error('Error setting up bulk import tables:', error);
      return { success: false, error };
    }
  }
}

/**
 * React hook for database setup functionality
 */
export function useDatabaseSetup() {
  const [isChecking, setIsChecking] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  const checkAndSetupDatabase = async () => {
    setIsChecking(true);
    setError(null);
    
    try {
      const tablesExist = await DatabaseSetupService.checkBulkImportTablesExist();
      
      if (!tablesExist) {
        setIsSettingUp(true);
        toast({
          title: "Setting up database",
          description: "Creating necessary tables for trail imports..."
        });
        
        const result = await DatabaseSetupService.setupBulkImportTables();
        
        if (!result.success) {
          throw new Error('Failed to set up database tables');
        }
        
        toast({
          title: "Database setup complete",
          description: "Successfully created trail import tables"
        });
      }
      
      return true;
    } catch (err) {
      console.error('Database setup error:', err);
      setError(err instanceof Error ? err : new Error('Unknown database setup error'));
      
      toast({
        title: "Database setup failed",
        description: "There was a problem setting up the database",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsChecking(false);
      setIsSettingUp(false);
    }
  };
  
  return {
    isChecking,
    isSettingUp,
    error,
    checkAndSetupDatabase
  };
}
