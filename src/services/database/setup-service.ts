
import { toast } from '@/hooks/use-toast';
import { BulkImportService } from './bulk-import';
import { TagsService } from './tags';

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
      // First set up the bulk import tables
      const bulkResult = await BulkImportService.setupBulkImportTables();
      if (!bulkResult.success) {
        return bulkResult;
      }
      
      // Then set up tag tables
      const tagResult = await TagsService.setupTagTables();
      if (!tagResult.success) {
        return tagResult;
      }
      
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
