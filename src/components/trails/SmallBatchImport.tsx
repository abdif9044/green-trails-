import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { TestTube, MapPin, Loader2, CheckCircle, AlertCircle, Shield, Database, Trash2 } from 'lucide-react';
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

const SmallBatchImport: React.FC = () => {
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
  const [isClearing, setIsClearing] = useState(false);
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

  const startTestImport = async (trailCount: number) => {
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
      
      const trailsPerSource = Math.floor(trailCount / readiness.active_sources);
      
      toast({
        title: "Starting Test Import",
        description: `Importing ${trailCount} trails (${trailsPerSource} per source)...`,
      });

      // Call the optimized bulk import with smaller limits
      const { data, error } = await supabase.functions.invoke('bulk-import-trails-optimized', {
        body: {
          maxTrailsPerSource: trailsPerSource,
          batchSize: 25, // Smaller batch size for testing
          target: `${trailCount}`,
          totalTrailLimit: trailCount,
          isTestImport: true,
          location: {
            name: 'United States',
            lat: 39.8283,
            lng: -98.5795,
            radius: 500 // Smaller radius for test
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
          title: "Test Import Started!",
          description: `Importing ${trailCount} trails from ${readiness.active_sources} sources.`,
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
          description: data?.error || "Failed to start the test import.",
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

  const clearDatabase = async () => {
    setIsClearing(true);
    try {
      const { error } = await supabase
        .from('trails')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all trails
      
      if (error) {
        throw error;
      }
      
      await getCurrentTrailCount();
      toast({
        title: "Database Cleared",
        description: "All trails have been removed from the database.",
      });
    } catch (error) {
      console.error('Error clearing database:', error);
      toast({
        title: "Clear Failed",
        description: error instanceof Error ? error.message : "Failed to clear database.",
        variant: "destructive"
      });
    } finally {
      setIsClearing(false);
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
                title: "Test Import Completed!",
                description: `Successfully imported ${(job.trails_added || 0).toLocaleString()} trails!`,
              });
            } else {
              setImportStatus(prev => ({ ...prev, status: 'error' }));
              toast({
                title: "Test Import Failed",
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
    }, 2000); // Poll every 2 seconds for faster feedback

    // Stop polling after 10 minutes
    setTimeout(() => clearInterval(pollInterval), 10 * 60 * 1000);
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
        return <TestTube className="h-5 w-5" />;
    }
  };

  const isImporting = ['validating', 'starting', 'processing'].includes(importStatus.status);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-6 w-6 text-greentrail-600" />
          Test Trail Import
        </CardTitle>
        <CardDescription>
          Start with smaller imports to test the system and validate data quality
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
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Current database contains {importStatus.currentTrailCount.toLocaleString()} trails
          </AlertDescription>
        </Alert>

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

        {/* Test Import Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button 
            onClick={() => startTestImport(1000)}
            disabled={isImporting || !readiness?.ready}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            {getStatusIcon()}
            Test 1K Trails
          </Button>
          
          <Button 
            onClick={() => startTestImport(5000)}
            disabled={isImporting || !readiness?.ready}
            className="w-full bg-green-600 hover:bg-green-700"
            size="sm"
          >
            {getStatusIcon()}
            Test 5K Trails
          </Button>
          
          <Button 
            onClick={() => startTestImport(10000)}
            disabled={isImporting || !readiness?.ready}
            className="w-full bg-purple-600 hover:bg-purple-700"
            size="sm"
          >
            {getStatusIcon()}
            Test 10K Trails
          </Button>
        </div>

        {/* Clear Database Button */}
        <Button 
          onClick={clearDatabase}
          disabled={isImporting || isClearing}
          variant="destructive"
          className="w-full"
          size="sm"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {isClearing ? 'Clearing...' : 'Clear Database'}
        </Button>

        <div className="text-xs text-muted-foreground">
          Test imports use smaller batches and timeouts to identify issues before running large imports. 
          Use "Clear Database" to reset between tests.
        </div>
      </CardContent>
    </Card>
  );
};

export default SmallBatchImport;