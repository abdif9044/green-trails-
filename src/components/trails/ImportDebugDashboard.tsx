
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Loading } from '@/components/Loading';
import { useEnvironmentValidation } from '@/hooks/useEnvironmentValidation';
import { 
  Bug, 
  Database, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  Activity,
  Zap,
  Target,
  WifiOff
} from 'lucide-react';

interface DebugReport {
  timestamp: string;
  system_status: {
    total_trails: number;
    total_import_jobs: number;
    pending_jobs: number;
    stalled_jobs_fixed: number;
    active_data_sources: number;
  };
  api_keys: {
    configured: string[];
    missing: string[];
  };
  api_tests: Record<string, {
    status: string;
    error?: string;
    trails_returned?: number;
    parks_returned?: number;
    elements_returned?: number;
  }>;
  database_test: {
    status: string;
    error?: string;
  };
  recommendations: string[];
}

const ImportDebugDashboard: React.FC = () => {
  const [debugReport, setDebugReport] = useState<DebugReport | null>(null);
  const [isDebugging, setIsDebugging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { toast } = useToast();
  const { status: envStatus, loading: envLoading } = useEnvironmentValidation();

  const runDebugAnalysis = async () => {
    setIsDebugging(true);
    setConnectionError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('debug-import-system');
      
      if (error) {
        throw new Error(error.message || 'Debug analysis failed');
      }
      
      setDebugReport(data);
      
      toast({
        title: "Debug Analysis Complete",
        description: `Found ${data.recommendations?.length || 0} recommendations`,
      });
      
    } catch (error) {
      console.error('Debug analysis failed:', error);
      setConnectionError(error instanceof Error ? error.message : 'Unknown error occurred');
      
      // Provide fallback debug report for development
      setDebugReport({
        timestamp: new Date().toISOString(),
        system_status: {
          total_trails: 0,
          total_import_jobs: 0,
          pending_jobs: 0,
          stalled_jobs_fixed: 0,
          active_data_sources: 0
        },
        api_keys: {
          configured: [],
          missing: ['HIKING_PROJECT_KEY', 'NPS_API_KEY', 'OPENWEATHER_API_KEY']
        },
        api_tests: {},
        database_test: {
          status: 'error',
          error: 'Connection failed'
        },
        recommendations: [
          'Configure API keys for trail data sources',
          'Check network connectivity',
          'Verify Supabase configuration'
        ]
      });
      
      toast({
        title: "Debug Failed - Using Fallback Data",
        description: "Running in development mode with limited functionality",
        variant: "destructive",
      });
    } finally {
      setIsDebugging(false);
    }
  };

  const startMassiveImport = async () => {
    if (!debugReport || connectionError) {
      toast({
        title: "Cannot Start Import",
        description: "Please run debug analysis first to verify system status",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setImportProgress(0);
    
    try {
      // Simulate import progress for development
      const progressInterval = setInterval(() => {
        setImportProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 1000);

      const { data, error } = await supabase.functions.invoke('massive-trail-import', {
        body: {
          target_count: 10000,
          regions: ['all']
        }
      });
      
      clearInterval(progressInterval);
      setImportProgress(100);
      
      if (error) {
        throw new Error(error.message || 'Import failed');
      }
      
      toast({
        title: "Import Started Successfully!",
        description: `Processing ${data?.total_imported || 'thousands of'} trails`,
      });
      
      // Refresh debug report after successful import
      setTimeout(() => {
        runDebugAnalysis();
        setIsImporting(false);
        setImportProgress(0);
      }, 3000);
      
    } catch (error) {
      console.error('Import failed:', error);
      setImportProgress(0);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Could not start trail import process",
        variant: "destructive",
      });
      setIsImporting(false);
    }
  };

  useEffect(() => {
    if (!envLoading) {
      runDebugAnalysis();
    }
  }, [envLoading]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'missing_key': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  if (envLoading) {
    return <Loading message="Validating environment..." />;
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6 p-6">
        {/* Environment Status Alert */}
        {!envStatus.isValid && (
          <Alert variant="destructive">
            <WifiOff className="h-4 w-4" />
            <AlertDescription>
              Environment issues detected: {envStatus.warnings.join(', ')}
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5 text-blue-600" />
              Trail Import Debug Dashboard
            </CardTitle>
            <CardDescription>
              Comprehensive debugging and mass import system for GreenTrails
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Last analysis: {debugReport?.timestamp ? new Date(debugReport.timestamp).toLocaleTimeString() : 'Never'}
                </div>
                {connectionError && (
                  <Badge variant="destructive" className="text-xs">
                    Connection Error
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={runDebugAnalysis}
                  disabled={isDebugging}
                >
                  {isDebugging ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Debug System
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={startMassiveImport}
                  disabled={isImporting || isDebugging || !!connectionError}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isImporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                  Import 10K+ Trails
                </Button>
              </div>
            </div>
            
            {isImporting && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Mass Import Progress</span>
                </div>
                <Progress value={importProgress} className="w-full" />
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round(importProgress)}% complete - Importing trails from multiple sources
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {debugReport && (
          <>
            {/* System Status */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Database Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs">Total Trails</span>
                      <Badge variant="secondary" className="text-lg font-bold">
                        {debugReport.system_status.total_trails?.toLocaleString() || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs">Import Jobs</span>
                      <Badge variant="outline">{debugReport.system_status.total_import_jobs}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs">Data Sources</span>
                      <Badge variant="outline">{debugReport.system_status.active_data_sources}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">API Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs">Configured</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        {debugReport.api_keys.configured.length}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs">Missing</span>
                      <Badge variant="destructive">
                        {debugReport.api_keys.missing.length}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">
                      {debugReport.api_keys.configured.join(', ') || 'None configured'}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Database</span>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(debugReport.database_test.status)}
                        <Badge className={getStatusColor(debugReport.database_test.status)}>
                          {debugReport.database_test.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {debugReport.system_status.stalled_jobs_fixed > 0 && 
                        `Fixed ${debugReport.system_status.stalled_jobs_fixed} stalled jobs`
                      }
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* API Test Results */}
            {Object.keys(debugReport.api_tests).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">API Connectivity Tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {Object.entries(debugReport.api_tests).map(([api, result]) => (
                      <div key={api} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium capitalize">{api.replace('_', ' ')}</span>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(result.status)}
                            <Badge className={getStatusColor(result.status)}>
                              {result.status}
                            </Badge>
                          </div>
                        </div>
                        {result.error ? (
                          <div className="text-xs text-red-600">{result.error}</div>
                        ) : (
                          <div className="text-xs text-gray-600">
                            {result.trails_returned !== undefined && `${result.trails_returned} trails found`}
                            {result.parks_returned !== undefined && `${result.parks_returned} parks found`}
                            {result.elements_returned !== undefined && `${result.elements_returned} elements found`}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {debugReport.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="h-4 w-4" />
                    System Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {debugReport.recommendations.map((rec, index) => (
                      <Alert key={index} variant={rec.includes('CRITICAL') ? 'destructive' : 'default'}>
                        <AlertDescription>{rec}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default ImportDebugDashboard;
