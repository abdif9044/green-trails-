
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DatabaseSetupService } from '@/services/database/setup-service';

export function useDBSetup(onSetupComplete: () => void) {
  const [isSettingUpDb, setIsSettingUpDb] = useState(false);
  const [dbSetupError, setDbSetupError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const checkAndSetupDatabase = async () => {
    setIsSettingUpDb(true);
    setDbSetupError(null);
    
    try {
      const tablesExist = await DatabaseSetupService.checkBulkImportTablesExist();
      
      if (!tablesExist) {
        toast({
          title: "Setting up database",
          description: "Creating necessary tables for bulk import...",
        });
        
        const result = await DatabaseSetupService.setupBulkImportTables();
        
        if (!result.success) {
          setDbSetupError("Failed to set up database tables. See console for details.");
          toast({
            title: "Database setup failed",
            description: "Failed to create necessary tables for bulk import.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Database setup complete",
            description: "Successfully created bulk import tables.",
          });
          onSetupComplete();
        }
      }
    } catch (error) {
      console.error('Error checking/setting up database:', error);
      setDbSetupError("An unexpected error occurred while checking database setup.");
      toast({
        title: "Database check failed",
        description: "Failed to check database setup status.",
        variant: "destructive",
      });
    } finally {
      setIsSettingUpDb(false);
    }
  };
  
  const retryDatabaseSetup = async () => {
    await checkAndSetupDatabase();
  };
  
  return {
    isSettingUpDb,
    dbSetupError,
    checkAndSetupDatabase,
    retryDatabaseSetup
  };
}
