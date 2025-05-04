
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";

interface DatabaseSetupAlertsProps {
  isSettingUpDb: boolean;
  dbSetupError: boolean;
  retryDatabaseSetup: () => Promise<void>;
}

const DatabaseSetupAlerts: React.FC<DatabaseSetupAlertsProps> = ({
  isSettingUpDb,
  dbSetupError,
  retryDatabaseSetup
}) => {
  if (!isSettingUpDb && !dbSetupError) return null;
  
  return (
    <div className="mb-6">
      {isSettingUpDb && (
        <Alert className="bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <AlertTitle>Setting up database</AlertTitle>
          <AlertDescription>
            Creating required database tables for trail imports. This may take a moment...
          </AlertDescription>
        </Alert>
      )}

      {dbSetupError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertTitle>Database setup error</AlertTitle>
          <AlertDescription className="flex flex-col space-y-2">
            <span>Failed to set up required database tables. This may happen if there was a database error.</span>
            <Button 
              variant="destructive" 
              size="sm" 
              className="w-fit"
              onClick={retryDatabaseSetup}
            >
              Retry Setup
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DatabaseSetupAlerts;
