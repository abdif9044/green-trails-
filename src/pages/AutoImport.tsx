
import React, { useEffect } from 'react';
import { useAutoTrailImport } from '@/hooks/useAutoTrailImport';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { 
  Database, 
  Zap, 
  CheckCircle, 
  Loader2, 
  AlertTriangle,
  TreePine
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOProvider from '@/components/SEOProvider';
import MinnesotaImport from '@/components/trails/MinnesotaImport';

const AutoImport: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const {
    loading,
    error,
    isSettingUpDb,
    isImportTriggered,
    isImportComplete,
    bulkProgress,
    activeBulkJobId,
    initializeAutoImport,
  } = useAutoTrailImport();

  useEffect(() => {
    // Auto-start the import process when component mounts
    if (!loading && !isImportTriggered && !error) {
      initializeAutoImport();
    }
  }, [loading, isImportTriggered, error, initializeAutoImport]);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOProvider 
        title="Minnesota Trail Import - GreenTrails"
        description="Import 10,000 trails from Minnesota and surrounding areas"
      />
      
      <Navbar />
      
      <div className="flex-grow bg-slate-50 dark:bg-greentrail-950 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-4">
              Minnesota Trail Import
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Import 10,000 trails from Minnesota state parks, national forests, and local trail systems
            </p>
          </div>

          {/* Minnesota Import Component */}
          <div className="mb-8">
            <MinnesotaImport />
          </div>

          {/* Auto Import Status */}
          {(loading || isSettingUpDb || isImportTriggered || activeBulkJobId) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isImportComplete ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  )}
                  Auto Import Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isSettingUpDb && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <Database className="h-4 w-4" />
                      <span>Setting up database tables...</span>
                    </div>
                  )}
                  
                  {isImportTriggered && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Import Progress</span>
                        <Badge variant="secondary">{bulkProgress}%</Badge>
                      </div>
                      <Progress value={bulkProgress} className="w-full" />
                    </div>
                  )}
                  
                  {isImportComplete && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Import completed successfully!</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <Card className="mb-6 border-red-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">Import Error</span>
                </div>
                <p className="text-red-600 mt-2">{error}</p>
                <Button 
                  onClick={initializeAutoImport}
                  variant="outline"
                  className="mt-3"
                >
                  Retry Import
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Navigation Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TreePine className="h-5 w-5 text-green-600" />
                  Discover Trails
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Explore the imported Minnesota trails
                </CardDescription>
                <Button 
                  onClick={() => navigate('/discover')}
                  className="w-full"
                >
                  Browse Trails
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Admin Import
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Advanced import tools and monitoring
                </CardDescription>
                <Button 
                  onClick={() => navigate('/admin/import')}
                  variant="outline"
                  className="w-full"
                >
                  Admin Panel
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-purple-600" />
                  Auto Setup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Automated production setup
                </CardDescription>
                <Button 
                  onClick={() => navigate('/admin/auto-import')}
                  variant="outline"
                  className="w-full"
                >
                  Production Setup
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AutoImport;
