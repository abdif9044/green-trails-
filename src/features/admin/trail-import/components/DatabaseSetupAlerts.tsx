
import React from "react";
import { Loader2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface DatabaseSetupAlertsProps {
  isSettingUpDb: boolean;
  dbSetupError: boolean;
  retryDatabaseSetup: () => Promise<void>;
}

const DatabaseSetupAlerts: React.FC<DatabaseSetupAlertsProps> = ({
  isSettingUpDb,
  dbSetupError,
  retryDatabaseSetup,
}) => {
  if (!isSettingUpDb && !dbSetupError) return null;
  
  return (
    <>
      {isSettingUpDb && (
        <Alert className="mb-6 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
          <AlertTitle className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Setting up bulk import database
          </AlertTitle>
          <AlertDescription>
            This is a one-time setup to create necessary database tables for bulk importing trails.
          </AlertDescription>
        </Alert>
      )}
      
      {dbSetupError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Database setup failed</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>Could not create required database tables for bulk importing. Please check console for details.</span>
            <button 
              onClick={retryDatabaseSetup}
              className="px-3 py-1 text-sm bg-white text-red-600 hover:bg-red-50 rounded"
            >
              Try Again
            </button>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default DatabaseSetupAlerts;
