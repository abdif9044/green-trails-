
import React, { useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import SEOProvider from '@/components/SEOProvider';
import { useAutoTrailImport } from '@/hooks/useAutoTrailImport';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AutoImportPage: React.FC = () => {
  const {
    loading,
    error,
    isSettingUpDb,
    isImportTriggered,
    isImportComplete,
    bulkProgress,
    activeBulkJobId,
    initializeAutoImport
  } = useAutoTrailImport();
  
  // Start the import process when the component mounts
  useEffect(() => {
    initializeAutoImport();
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-greentrail-50 to-greentrail-100 dark:from-greentrail-900 dark:to-greentrail-950 flex items-center justify-center p-4">
      <SEOProvider
        title="Auto-Importing Trail Data - GreenTrails"
        description="Automatically importing trail data for your hiking adventures"
      />
      
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <img 
              src="/lovable-uploads/0c2a9cc4-4fdb-4d4a-965c-47b406e4ec4e.png" 
              alt="GreenTrails Logo" 
              className="h-8 w-auto mr-2"
            />
            Trail Data Import
          </CardTitle>
          <CardDescription>
            Automatically importing trail data for GreenTrails
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Status messages */}
          <div className="space-y-6">
            {/* Database setup status */}
            <div className="flex items-center">
              {isSettingUpDb ? (
                <Loader2 className="h-5 w-5 animate-spin text-greentrail-600 mr-2" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
              )}
              <span className={isSettingUpDb ? "text-greentrail-800" : "text-green-700"}>
                Database setup {isSettingUpDb ? "in progress..." : "complete"}
              </span>
            </div>
            
            {/* Import status */}
            <div className="flex items-center">
              {isImportTriggered && activeBulkJobId ? (
                <Loader2 className="h-5 w-5 animate-spin text-greentrail-600 mr-2" />
              ) : isImportTriggered ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
              ) : loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-greentrail-600 mr-2" />
              ) : (
                <>{error ? <AlertTriangle className="h-5 w-5 text-red-500 mr-2" /> : null}</>
              )}
              <span>
                {isImportTriggered && activeBulkJobId 
                  ? "Import in progress..." 
                  : isImportTriggered 
                  ? "Import complete!" 
                  : loading 
                  ? "Preparing import..." 
                  : error 
                  ? "Import failed" 
                  : "Waiting to start..."}
              </span>
            </div>
            
            {/* Progress bar for import */}
            {isImportTriggered && activeBulkJobId && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Import progress</span>
                  <span>{bulkProgress}%</span>
                </div>
                <Progress value={bulkProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Importing trail data... this may take several minutes
                </p>
              </div>
            )}
            
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 dark:bg-red-900/20 dark:border-red-800">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}
            
            {/* Success message */}
            {isImportComplete && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 dark:bg-green-900/20 dark:border-green-800">
                <p className="text-green-800 dark:text-green-200">
                  Import completed successfully! Redirecting to discover page...
                </p>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter>
          <div className="flex justify-between w-full">
            {error && (
              <Button 
                onClick={initializeAutoImport}
                disabled={loading || isSettingUpDb || isImportTriggered}
              >
                Retry Import
              </Button>
            )}
            <Button 
              variant="outline" 
              asChild 
              className="ml-auto"
            >
              <Link to="/discover">
                Go to Discover
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <Toaster />
    </div>
  );
};

export default AutoImportPage;
