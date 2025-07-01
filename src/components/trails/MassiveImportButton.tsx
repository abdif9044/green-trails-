import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Download, MapPin, Loader2, CheckCircle, AlertCircle, Shield, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImportStatus {
  jobId: string;
  status: 'idle' | 'validating' | 'starting' | 'processing' | 'completed' | 'error';
  progress: number;
  totalProcessed: number;
  totalAdded: number;
  totalFailed: number;
  currentTrailCount: number;
}

interface ReadinessCheck {
  ready: boolean;
  active_sources: number;
  total_sources: number;
  issues: string[];
}

const MassiveImportButton: React.FC = () => {
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    jobId: '',
    status: 'idle',
    progress: 0,
    totalProcessed: 0,
    totalAdded: 0,
    totalFailed: 0,
    currentTrailCount: 0
  });
  
  const [readiness, setReadiness] = useState<ReadinessCheck | null>(null);
  const { toast } = useToast();

  // Check system readiness on component mount
  useEffect(() => {
    checkSystemReadiness();
    getCurrentTrailCount();
  }, []);

  const checkSystemReadiness = async () => {
    try {
      const { data, error } = await supabase.rpc('validate_import_readiness');
      
      if (error) {
        console.error('Error checking readiness:', error);
        return;
      }
      
      if (data && data.length > 0) {
        setReadiness(data[0]);
      }
    } catch (error) {
      console.error('Failed to check system readiness:', error);
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

  const startMassiveImport = async () => {
    setImportStatus(prev => ({ ...prev, status: 'validating' }));
    
    try {
      // Pre-import validation
      await checkSystemReadiness();
      
      if (!readiness?.ready) {
        toast({
          title: "System Not Ready",
          description: `Cannot start import: ${readiness?.issues?.join(', ') || 'Unknown issues'}`,
          variant: "destructive"
        });
        setImportStatus(prev => ({ ...prev, status: 'error' }));
        return;
      }

      setImportStatus(prev => ({ ...prev, status: 'starting' }));
      
      toast({
        title: "Starting Import",
        description: `Using ${readiness.active_sources} active data sources...`,
      });

      // Call the new optimized bulk import edge function
      const { data, error } = await supabase.functions.invoke('bulk-import-trails-optimized', {
        body: {
          maxTrailsPerSource: 8000,
          batchSize: 50,
          target: '50K',
          location: {
            name: 'United States',
            lat: 39.8283,
            lng: -98.5795,
            radius: 1500 // miles - covers entire US
          }
        }
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
          totalFailed: data.total_failed || 0
        }));
        
        toast({
          title: "Import Started!",
          description: `Importing from ${readiness.active_sources} sources. This may take 10-20 minutes.`,
        });
        
        // Start polling for progress
        if (data.job_id) {
          pollProgress(data.job_id);
        } else {
          // Import completed immediately
          setImportStatus(prev => ({
            ...prev,
            status: 'completed',
            progress: 100,
            totalProcessed: data.total_processed || 0,
            totalAdded: data.total_added || 0,
            totalFailed: data.total_failed || 0
          }));
          
          await getCurrentTrailCount();
        }
      } else {
        setImportStatus(prev => ({ ...prev, status: 'error' }));
        toast({
          title: "Import Failed",
          description: data?.error || "Failed to start the massive trail import.",
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

  const pollProgress = async (jobId: string) => {
    const pollInterval = setInterval(async () => {
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
            
          setImportStatus(prev => ({
            ...prev,
            status: job.status === 'completed' ? 'completed' : 'processing',
            progress: progressPercent,
            totalProcessed: job.trails_processed || 0,
            totalAdded: job.trails_added || 0,
            totalFailed: job.trails_failed || 0
          }));

          if (job.status === 'completed' || job.status === 'error') {
            clearInterval(pollInterval);
            
            if (job.status === 'completed') {
              await getCurrentTrailCount();
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
        console.error('Error polling progress:', error);
        clearInterval(pollInterval);
      }
    }, 3000); // Poll every 3 seconds

    // Stop polling after 30 minutes
    setTimeout(() => clearInterval(pollInterval), 30 * 60 * 1000);
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-greentrail-600" />
          Massive Trail Import
        </CardTitle>
        <CardDescription>
          Import 50,000+ real trails from verified data sources with pre-import validation
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* System Readiness Status */}
        {readiness && (
          <Alert className={readiness.ready ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <Database className="h-4 w-4" />
            <AlertDescription>
              <div className="flex justify-between items-center">
                <span>
                  System Status: {readiness.ready ? 'Ready' : 'Not Ready'}
                </span>
                <span className="text-sm text-muted-foreground">
                  {readiness.active_sources} active sources
                </span>
              </div>
              {!readiness.ready && readiness.issues && (
                <div className="mt-2 text-sm">
                  Issues: {readiness.issues.join(', ')}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Current Trail Count */}
        {importStatus.currentTrailCount > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Current database contains {importStatus.currentTrailCount.toLocaleString()} trails
            </AlertDescription>
          </Alert>
        )}

        {/* Import Progress */}
        {isImporting && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Import Progress</span>
              <span>{importStatus.totalAdded.toLocaleString()} trails added</span>
            </div>
            <Progress value={importStatus.progress} className="w-full" />
            <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>Processed: {importStatus.totalProcessed.toLocaleString()}</div>
              <div>Added: {importStatus.totalAdded.toLocaleString()}</div>
              <div>Failed: {importStatus.totalFailed.toLocaleString()}</div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {importStatus.status === 'completed' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              Successfully imported {importStatus.totalAdded.toLocaleString()} trails! 
              Total trails in database: {importStatus.currentTrailCount.toLocaleString()}
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {importStatus.status === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Import failed. Please check the system status and try again.
            </AlertDescription>
          </Alert>
        )}

        {/* Import Button */}
        <Button 
          onClick={startMassiveImport}
          disabled={isImporting || !readiness?.ready}
          className="w-full bg-greentrail-600 hover:bg-greentrail-700"
          size="lg"
        >
          {getStatusIcon()}
          {importStatus.status === 'idle' && 'Import 50,000+ Trails'}
          {importStatus.status === 'validating' && 'Validating System...'}
          {importStatus.status === 'starting' && 'Starting Import...'}
          {importStatus.status === 'processing' && 'Importing Trails...'}
          {importStatus.status === 'completed' && 'Import Completed'}
          {importStatus.status === 'error' && 'Retry Import'}
        </Button>

        <div className="text-xs text-muted-foreground">
          This will import trail data from {readiness?.active_sources || 'multiple'} verified sources 
          including USGS, National Parks Service, and OpenStreetMap. 
          The process includes pre-import validation and may take 10-20 minutes to complete.
        </div>
      </CardContent>
    </Card>
  );
};

export default MassiveImportButton;