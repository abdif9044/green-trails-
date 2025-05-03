
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDatabaseSetup } from "@/services/database-setup-service";

export function useDBSetup(loadData: () => void) {
  const [isSettingUpDb, setIsSettingUpDb] = useState(false);
  const [dbSetupError, setDbSetupError] = useState(false);
  const { toast } = useToast();
  
  const { setupBulkImport, checkTablesExist } = useDatabaseSetup();
  
  const checkAndSetupDatabase = async () => {
    if (isSettingUpDb || dbSetupError) return;
    
    setIsSettingUpDb(true);
    try {
      // First check if tables exist
      const tablesExist = await checkTablesExist();
      
      if (!tablesExist) {
        // Setup tables if they don't exist
        const success = await setupBulkImport();
        if (success) {
          // Reload data after successful setup
          loadData();
        } else {
          setDbSetupError(true);
        }
      }
    } catch (error) {
      console.error("Error checking database status:", error);
      setDbSetupError(true);
    } finally {
      setIsSettingUpDb(false);
    }
  };
  
  const retryDatabaseSetup = async () => {
    setDbSetupError(false);
    setIsSettingUpDb(true);
    try {
      const success = await setupBulkImport();
      if (success) {
        loadData();
      } else {
        setDbSetupError(true);
      }
    } catch (error) {
      console.error("Error during database setup retry:", error);
      setDbSetupError(true);
    } finally {
      setIsSettingUpDb(false);
    }
  };
  
  return {
    isSettingUpDb,
    dbSetupError,
    checkAndSetupDatabase,
    retryDatabaseSetup
  };
}
