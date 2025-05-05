
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Database, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  if (isSettingUpDb) {
    return (
      <Alert className="mb-4 bg-blue-50 border-blue-200">
        <Database className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-700 flex items-center">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Setting up database
        </AlertTitle>
        <AlertDescription className="text-blue-600">
          Creating required tables for trail import. This may take a moment...
        </AlertDescription>
      </Alert>
    );
  }
  
  if (dbSetupError) {
    return (
      <Alert className="mb-4 bg-red-50 border-red-200">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-700">Database setup failed</AlertTitle>
        <AlertDescription className="text-red-600 flex flex-col space-y-2">
          <span>There was a problem setting up the database for trail imports.</span>
          <Button 
            onClick={retryDatabaseSetup} 
            variant="outline" 
            className="self-start mt-2 bg-white border-red-300 text-red-600 hover:bg-red-50"
          >
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};

export default DatabaseSetupAlerts;
