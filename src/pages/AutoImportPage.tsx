
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
      
      <Toaster />
      
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <img 
              src="/logo.png" 
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
              {!isImportTriggered ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-greentrail-600 mr-2" />
                  <span>Preparing trail import...</span>
                </>
              ) : isImportComplete ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-700">Trail import complete</span>
                </>
              ) : (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-greentrail-600 mr-2" />
                  <span>Importing trail data...</span>
                </>
              )}
            </div>
            
            {/* Progress bar */}
            {(isImportTriggered && !isImportComplete) && (
              <div className="space-y-2">
                <Progress value={bulkProgress} className="h-2" />
                <p className="text-sm text-center text-greentrail-700">{bulkProgress}% complete</p>
              </div>
            )}
            
            {/* Error message */}
            {error && (
              <div className="flex items-center text-red-500">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          {isImportComplete ? (
            <Link to="/discover">
              <Button className="bg-greentrail-600 hover:bg-greentrail-700">
                Start Exploring Trails
              </Button>
            </Link>
          ) : (
            <p className="text-sm text-gray-500">
              {loading ? "Loading..." : "This might take several minutes. Please don't close this page."}
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AutoImportPage;
