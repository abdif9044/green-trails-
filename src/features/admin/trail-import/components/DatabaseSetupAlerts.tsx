
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";

interface DatabaseSetupAlertsProps {
  isSettingUpDb: boolean;
  dbSetupError: string | null;
  retryDatabaseSetup: () => void;
}

const DatabaseSetupAlerts: React.FC<DatabaseSetupAlertsProps> = ({
  isSettingUpDb,
  dbSetupError,
  retryDatabaseSetup
}) => {
  if (isSettingUpDb) {
    return (
      <Alert className="mb-6 bg-blue-50 dark:bg-blue-900">
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        <AlertTitle>Setting up database</AlertTitle>
        <AlertDescription>
          Creating necessary tables for bulk import functionality...
        </AlertDescription>
      </Alert>
    );
  }
  
  if (dbSetupError) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertTitle>Database setup failed</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>{dbSetupError}</span>
          <Button variant="outline" size="sm" onClick={retryDatabaseSetup}>
            Retry Setup
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};

export default DatabaseSetupAlerts;
