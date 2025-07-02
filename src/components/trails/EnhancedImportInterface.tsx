import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  MapPin, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Shield, 
  Database,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Info
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImportStatus {
  jobId: string;
  status: 'idle' | 'validating' | 'starting' | 'processing' | 'paused' | 'completed' | 'error';
  progress: number;
  totalProcessed: number;
  totalAdded: number;
  totalFailed: number;
  currentTrailCount: number;
  sourceResults?: {
    [key: string]: {
      processed: number;
      inserted: number;
      failed: number;
      errors?: string[];
      success_rate?: number;
    };
  };
  estimatedTimeRemaining?: string;
  importSpeed?: number; // trails per minute
}

interface ImportConfiguration {
  maxTrailsPerSource: number;
  batchSize: number;
  enableDuplicateDetection: boolean;
  enableQualityFiltering: boolean;
  minQualityScore: number;
  location?: {
    name: string;
    lat: number;
    lng: number;
    radius: number;
  };
}

const EnhancedImportInterface: React.FC = () => {
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    jobId: '',
    status: 'idle',
    progress: 0,
    totalProcessed: 0,
    totalAdded: 0,
    totalFailed: 0,
    currentTrailCount: 0
  });

  const [config, setConfig] = useState<ImportConfiguration>({
    maxTrailsPerSource: 3000,
    batchSize: 50,
    enableDuplicateDetection: true,
    enableQualityFiltering: true,
    minQualityScore: 0.7,
    location: {
      name: 'United States',
      lat: 39.8283,
      lng: -98.5795,
      radius: 1500
    }
  });

  const [systemReadiness, setSystemReadiness] = useState<any>(null);
  const [importLogs, setImportLogs] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    checkSystemReadiness();
    getCurrentTrailCount();
    getRecentImportLogs();
  }, []);

  const checkSystemReadiness = async () => {
    try {
      const { data, error } = await supabase.rpc('validate_import_readiness');
      if (!error && data && data.length > 0) {
        setSystemReadiness(data[0]);
      }
    } catch (error) {
      console.error('Error checking system readiness:', error);
    }
  };

  const getCurrentTrailCount = async () => {
    try {
      const { count, error } = await supabase
        .from('trails')
        .select('*', { count: 'exact', head: true });
      
      if (!error && count !== null) {
        setImportStatus(prev => ({ ...prev, currentTrailCount: count }));
      }
    } catch (error) {
      console.error('Error getting trail count:', error);
    }
  };

  const getRecentImportLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('import_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (!error && data) {
        setImportLogs(data);
      }
    } catch (error) {
      console.error('Error fetching import logs:', error);
    }
  };

  const startComprehensiveImport = async () => {
    setImportStatus(prev => ({ ...prev, status: 'validating' }));
    
    try {
      // Pre-import validation
      await checkSystemReadiness();
      
      if (!systemReadiness?.ready) {
        toast({
          title: "System Not Ready",
          description: `Cannot start import: ${systemReadiness?.issues?.join(', ') || 'Unknown issues'}`,
          variant: "destructive"
        });
        setImportStatus(prev => ({ ...prev, status: 'error' }));
        return;
      }

      setImportStatus(prev => ({ ...prev, status: 'starting' }));
      
      toast({
        title: "Starting Comprehensive Import",
        description: `Importing ${config.maxTrailsPerSource} trails per source with quality filtering...`,
      });

      // Call the comprehensive import edge function
      const { data, error } = await supabase.functions.invoke('comprehensive-trail-import', {
        body: config
      });
      
      if (error) {
        throw error;
      }
      
      if (data?.success) {
        setImportStatus(prev => ({
          ...prev,
          jobId: data.job_id,
          status: 'processing',
          totalProcessed: data.total_processed || 0,
          totalAdded: data.total_added || 0,
          totalFailed: data.total_failed || 0,
          sourceResults: data.source_results
        }));
        
        toast({
          title: "Import Started!",
          description: `Processing trails from ${systemReadiness.active_sources} sources.`,
        });
        
        // Start progress monitoring
        if (data.job_id) {
          monitorProgress(data.job_id);
        } else {
          // Import completed immediately
          setImportStatus(prev => ({
            ...prev,
            status: 'completed',
            progress: 100
          }));
          await getCurrentTrailCount();
          await getRecentImportLogs();
        }
      } else {
        setImportStatus(prev => ({ ...prev, status: 'error' }));
        toast({
          title: "Import Failed",
          description: data?.error || "Failed to start the trail import.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error starting import:', error);
      setImportStatus(prev => ({ ...prev, status: 'error' }));
      toast({
        title: "Import Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive"
      });
    }
  };

  const monitorProgress = async (jobId: string) => {
    const startTime = Date.now();
    
    const monitor = setInterval(async () => {
      try {
        const { data: job, error } = await supabase
          .from('bulk_import_jobs')
          .select('*')
          .eq('id', jobId)
          .single();
        
        if (!error && job) {
          const progressPercent = job.total_trails_requested > 0 
            ? Math.min((job.trails_added / job.total_trails_requested) * 100, 100)
            : 0;

          // Calculate import speed
          const elapsed = Date.now() - startTime;
          const minutesElapsed = elapsed / (1000 * 60);
          const importSpeed = minutesElapsed > 0 ? Math.round(job.trails_added / minutesElapsed) : 0;

          // Calculate ETA
          const remaining = job.total_trails_requested - job.trails_added;
          const eta = importSpeed > 0 ? Math.round(remaining / importSpeed) : 0;
            
          setImportStatus(prev => ({
            ...prev,
            status: job.status === 'completed' ? 'completed' : 'processing',
            progress: progressPercent,
            totalProcessed: job.trails_processed || 0,
            totalAdded: job.trails_added || 0,
            totalFailed: job.trails_failed || 0,
            sourceResults: job.results as any,
            importSpeed,
            estimatedTimeRemaining: eta > 0 ? `${eta} minutes` : 'Calculating...'
          }));

          if (job.status === 'completed' || job.status === 'error') {
            clearInterval(monitor);
            
            if (job.status === 'completed') {
              await getCurrentTrailCount();
              await getRecentImportLogs();
              toast({
                title: "Import Completed!",
                description: `Successfully imported ${(job.trails_added || 0).toLocaleString()} trails!`,
              });
            } else {
              setImportStatus(prev => ({ ...prev, status: 'error' }));
              toast({
                title: "Import Failed",
                description: job.error_message || "Import encountered errors.",
                variant: "destructive"
              });
            }
          }
        }
      } catch (error) {
        console.error('Error monitoring progress:', error);
        clearInterval(monitor);
      }
    }, 2000);

    // Stop monitoring after 30 minutes
    setTimeout(() => clearInterval(monitor), 30 * 60 * 1000);
  };

  const resetImport = () => {
    setImportStatus({
      jobId: '',
      status: 'idle',
      progress: 0,
      totalProcessed: 0,
      totalAdded: 0,
      totalFailed: 0,
      currentTrailCount: importStatus.currentTrailCount
    });
  };

  const getStatusIcon = () => {
    switch (importStatus.status) {
      case 'validating':
        return <Shield className="h-5 w-5 animate-pulse text-blue-600" />;
      case 'starting':
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Download className="h-5 w-5" />;
    }
  };

  const isImporting = ['validating', 'starting', 'processing'].includes(importStatus.status);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-greentrail-600" />
            Comprehensive Trail Import System
          </CardTitle>
          <CardDescription>
            Import real trail data from multiple verified APIs with advanced quality filtering and deduplication
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="import" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="import">Import</TabsTrigger>
              <TabsTrigger value="config">Configuration</TabsTrigger>
              <TabsTrigger value="logs">Import Logs</TabsTrigger>
              <TabsTrigger value="status">System Status</TabsTrigger>
            </TabsList>
            
            <TabsContent value="import" className="space-y-4">
              {/* System Readiness */}
              {systemReadiness && (
                <Alert className={systemReadiness.ready ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  <Database className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex justify-between items-center">
                      <span>System Status: {systemReadiness.ready ? 'Ready' : 'Not Ready'}</span>
                      <Badge variant={systemReadiness.ready ? "default" : "destructive"}>
                        {systemReadiness.active_sources} Active Sources
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Current Database Status */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex justify-between items-center">
                    <span>Current Database: {importStatus.currentTrailCount.toLocaleString()} trails</span>
                    <div className="flex gap-2">
                      <Badge variant="outline">Quality Filtering: {config.enableQualityFiltering ? 'ON' : 'OFF'}</Badge>
                      <Badge variant="outline">Duplicate Detection: {config.enableDuplicateDetection ? 'ON' : 'OFF'}</Badge>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              {/* Import Progress */}
              {isImporting && (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Import Progress</span>
                    <div className="flex gap-4">
                      <span>{importStatus.totalAdded.toLocaleString()} trails added</span>
                      {importStatus.importSpeed && (
                        <span>{importStatus.importSpeed} trails/min</span>
                      )}
                      {importStatus.estimatedTimeRemaining && (
                        <span>ETA: {importStatus.estimatedTimeRemaining}</span>
                      )}
                    </div>
                  </div>
                  <Progress value={importStatus.progress} className="w-full" />
                  
                  {/* Source Results */}
                  {importStatus.sourceResults && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {Object.entries(importStatus.sourceResults).map(([source, result]) => (
                        <div key={source} className="p-3 border rounded">
                          <div className="font-medium">{source}</div>
                          <div className="text-muted-foreground">
                            <div>Added: {result.inserted}</div>
                            <div>Failed: {result.failed}</div>
                            {result.success_rate !== undefined && (
                              <div>Success: {result.success_rate}%</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Success/Error Messages */}
              {importStatus.status === 'completed' && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    Successfully imported {importStatus.totalAdded.toLocaleString()} trails!
                    Total database size: {importStatus.currentTrailCount.toLocaleString()} trails
                  </AlertDescription>
                </Alert>
              )}

              {importStatus.status === 'error' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Import failed. Please check the system status and configuration.
                  </AlertDescription>
                </Alert>
              )}

              {/* Import Controls */}
              <div className="flex gap-3">
                <Button 
                  onClick={startComprehensiveImport}
                  disabled={isImporting || !systemReadiness?.ready}
                  className="flex-1 bg-greentrail-600 hover:bg-greentrail-700"
                  size="lg"
                >
                  {getStatusIcon()}
                  {importStatus.status === 'idle' && `Import ${config.maxTrailsPerSource.toLocaleString()} Trails`}
                  {importStatus.status === 'validating' && 'Validating System...'}
                  {importStatus.status === 'starting' && 'Starting Import...'}
                  {importStatus.status === 'processing' && 'Importing Trails...'}
                  {importStatus.status === 'completed' && 'Import Completed'}
                  {importStatus.status === 'error' && 'Retry Import'}
                </Button>
                
                {(importStatus.status === 'completed' || importStatus.status === 'error') && (
                  <Button onClick={resetImport} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="config" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Trails per Source</label>
                    <input
                      type="number"
                      value={config.maxTrailsPerSource}
                      onChange={(e) => setConfig(prev => ({ ...prev, maxTrailsPerSource: parseInt(e.target.value) || 1000 }))}
                      className="w-full p-2 border rounded"
                      min="100"
                      max="10000"
                      step="100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Batch Size</label>
                    <input
                      type="number"
                      value={config.batchSize}
                      onChange={(e) => setConfig(prev => ({ ...prev, batchSize: parseInt(e.target.value) || 50 }))}
                      className="w-full p-2 border rounded"
                      min="10"
                      max="200"
                      step="10"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Minimum Quality Score</label>
                    <input
                      type="number"
                      value={config.minQualityScore}
                      onChange={(e) => setConfig(prev => ({ ...prev, minQualityScore: parseFloat(e.target.value) || 0.7 }))}
                      className="w-full p-2 border rounded"
                      min="0"
                      max="1"
                      step="0.1"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.enableQualityFiltering}
                      onChange={(e) => setConfig(prev => ({ ...prev, enableQualityFiltering: e.target.checked }))}
                      id="quality-filtering"
                    />
                    <label htmlFor="quality-filtering" className="text-sm">Enable Quality Filtering</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.enableDuplicateDetection}
                      onChange={(e) => setConfig(prev => ({ ...prev, enableDuplicateDetection: e.target.checked }))}
                      id="duplicate-detection"
                    />
                    <label htmlFor="duplicate-detection" className="text-sm">Enable Duplicate Detection</label>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="logs" className="space-y-4">
              <div className="space-y-3">
                {importLogs.map((log) => (
                  <div key={log.id} className="p-3 border rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{log.source_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {log.successful_imports} imported, {log.failed_imports} failed
                        </div>
                      </div>
                      <Badge variant={log.successful_imports > 0 ? "default" : "destructive"}>
                        {new Date(log.created_at).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="status" className="space-y-4">
              {systemReadiness && (
                <div className="space-y-4">
                  <Alert className={systemReadiness.ready ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                    <Database className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <div>Ready: {systemReadiness.ready ? 'Yes' : 'No'}</div>
                        <div>Active Sources: {systemReadiness.active_sources}</div>
                        <div>Total Sources: {systemReadiness.total_sources}</div>
                        {systemReadiness.issues && systemReadiness.issues.length > 0 && (
                          <div>Issues: {systemReadiness.issues.join(', ')}</div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedImportInterface;