
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { 
  AlertTriangle, 
  CheckCircle, 
  Database, 
  RefreshCw, 
  Trash2,
  Play,
  Bug,
  Zap
} from 'lucide-react';

interface BulkImportJob {
  id: string;
  status: string;
  started_at: string;
  completed_at?: string;
  trails_processed: number;
  trails_added: number;
  trails_failed: number;
  results?: any;
  config?: any;
}

const TrailImportRecovery: React.FC = () => {
  const [jobs, setJobs] = useState<BulkImportJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [recovering, setRecovering] = useState(false);
  const [testingImport, setTestingImport] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [trailCount, setTrailCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadJobs();
    checkTrailCount();
  }, []);

  const loadJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('bulk_import_jobs')
        .select('*')
        .order('started_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkTrailCount = async () => {
    try {
      const { count } = await supabase
        .from('trails')
        .select('*', { count: 'exact', head: true });
      setTrailCount(count || 0);
    } catch (error) {
      console.error('Error checking trail count:', error);
    }
  };

  const cleanupStuckJobs = async () => {
    try {
      setCurrentStep('Cleaning up stuck jobs...');
      setProgress(10);

      const stuckJobs = jobs.filter(job => 
        job.status === 'processing' && 
        new Date().getTime() - new Date(job.started_at).getTime() > 3600000 // 1 hour
      );

      if (stuckJobs.length > 0) {
        const { error } = await supabase
          .from('bulk_import_jobs')
          .update({ 
            status: 'cancelled',
            completed_at: new Date().toISOString()
          })
          .in('id', stuckJobs.map(job => job.id));

        if (error) throw error;

        toast({
          title: "Cleanup completed",
          description: `Cancelled ${stuckJobs.length} stuck import jobs`,
        });
      }

      setProgress(25);
      return true;
    } catch (error) {
      console.error('Error cleaning up jobs:', error);
      return false;
    }
  };

  const testSmallImport = async () => {
    try {
      setCurrentStep('Testing small import (500 trails)...');
      setProgress(30);

      const { data, error } = await supabase.functions.invoke('import-trails-massive', {
        body: {
          sources: ['hiking_project'],
          maxTrailsPerSource: 500,
          batchSize: 50,
          concurrency: 1,
          priority: 'high',
          debug: true,
          validation: true
        }
      });

      if (error) throw error;

      setProgress(60);
      
      // Wait for import to complete
      let attempts = 0;
      while (attempts < 30) { // 5 minutes max
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
        
        const { data: jobData } = await supabase
          .from('bulk_import_jobs')
          .select('*')
          .eq('id', data.job_id)
          .single();

        if (jobData?.status === 'completed') {
          setProgress(80);
          await checkTrailCount();
          
          if (jobData.trails_added > 0) {
            toast({
              title: "Test import successful!",
              description: `Added ${jobData.trails_added} trails. Ready for full bootstrap.`,
            });
            return true;
          } else {
            throw new Error('Test import completed but no trails were added');
          }
        } else if (jobData?.status === 'error') {
          throw new Error('Test import failed');
        }
        
        attempts++;
        setProgress(60 + (attempts * 0.5));
      }

      throw new Error('Test import timed out');
    } catch (error) {
      console.error('Test import failed:', error);
      toast({
        title: "Test import failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
      return false;
    }
  };

  const fullBootstrap = async () => {
    try {
      setCurrentStep('Starting full database bootstrap...');
      setProgress(85);

      const { data, error } = await supabase.functions.invoke('import-trails-massive', {
        body: {
          sources: ['hiking_project', 'openstreetmap', 'usgs'],
          maxTrailsPerSource: 10000,
          batchSize: 100,
          concurrency: 2,
          priority: 'high',
          target: '25K'
        }
      });

      if (error) throw error;

      setProgress(100);
      setCurrentStep('Full bootstrap initiated! Check the import status.');
      
      toast({
        title: "Bootstrap started!",
        description: `Import job ${data.job_id} started. Database will be populated with 25,000+ trails.`,
      });

      // Refresh data
      await loadJobs();
      return true;
    } catch (error) {
      console.error('Bootstrap failed:', error);
      toast({
        title: "Bootstrap failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
      return false;
    }
  };

  const executeRecoveryPlan = async () => {
    setRecovering(true);
    setProgress(0);

    try {
      // Step 1: Cleanup stuck jobs
      const cleanupSuccess = await cleanupStuckJobs();
      if (!cleanupSuccess) {
        throw new Error('Failed to cleanup stuck jobs');
      }

      // Step 2: Test small import
      setTestingImport(true);
      const testSuccess = await testSmallImport();
      setTestingImport(false);
      
      if (!testSuccess) {
        throw new Error('Test import failed - need to investigate further');
      }

      // Step 3: Full bootstrap
      setBootstrapping(true);
      await fullBootstrap();
      setBootstrapping(false);

      setCurrentStep('Recovery plan completed successfully!');
      toast({
        title: "Recovery completed!",
        description: "Trail import system has been fixed and database bootstrap initiated.",
      });

    } catch (error) {
      console.error('Recovery plan failed:', error);
      toast({
        title: "Recovery failed",
        description: error instanceof Error ? error.message : 'Recovery plan encountered errors',
        variant: "destructive",
      });
    } finally {
      setRecovering(false);
      setTestingImport(false);
      setBootstrapping(false);
      await loadJobs();
      await checkTrailCount();
    }
  };

  const investigateFailures = async () => {
    try {
      setCurrentStep('Investigating import failures...');
      
      const failedJobs = jobs.filter(job => 
        job.status === 'completed' && job.trails_added === 0
      );

      console.log('Failed jobs analysis:', failedJobs.map(job => ({
        id: job.id,
        processed: job.trails_processed,
        failed: job.trails_failed,
        results: job.results,
        config: job.config
      })));

      toast({
        title: "Investigation complete",
        description: `Found ${failedJobs.length} jobs that processed trails but added none. Check console for details.`,
      });
    } catch (error) {
      console.error('Investigation failed:', error);
    }
  };

  const getJobStatusBadge = (job: BulkImportJob) => {
    if (job.status === 'completed' && job.trails_added > 0) {
      return <Badge className="bg-green-100 text-green-800">Success</Badge>;
    } else if (job.status === 'completed' && job.trails_added === 0) {
      return <Badge variant="destructive">Failed</Badge>;
    } else if (job.status === 'processing') {
      return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
    } else {
      return <Badge variant="secondary">{job.status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Trail Import Recovery Plan
          </CardTitle>
          <CardDescription>
            Current database has {trailCount} trails. Let's fix the import system and bootstrap your database.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recovering && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{currentStep}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <Button
              onClick={investigateFailures}
              variant="outline"
              disabled={recovering}
              className="flex items-center gap-2"
            >
              <Bug className="h-4 w-4" />
              Investigate
            </Button>
            
            <Button
              onClick={() => cleanupStuckJobs()}
              variant="outline"
              disabled={recovering}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Cleanup
            </Button>
            
            <Button
              onClick={() => testSmallImport()}
              variant="outline"
              disabled={recovering}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Test Import
            </Button>
            
            <Button
              onClick={executeRecoveryPlan}
              disabled={recovering}
              className="flex items-center gap-2 bg-greentrail-600 hover:bg-greentrail-700"
            >
              <Zap className="h-4 w-4" />
              {recovering ? 'Recovering...' : 'Execute Plan'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import Job History</CardTitle>
          <CardDescription>
            Analysis of recent bulk import attempts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-4">No import jobs found</div>
          ) : (
            <div className="space-y-2">
              {jobs.slice(0, 10).map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    {getJobStatusBadge(job)}
                    <div className="text-sm">
                      <div>Started: {new Date(job.started_at).toLocaleString()}</div>
                      <div className="text-muted-foreground">
                        Processed: {job.trails_processed} • Added: {job.trails_added} • Failed: {job.trails_failed}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    {job.trails_processed > 0 && (
                      <div className="font-medium">
                        Success Rate: {Math.round((job.trails_added / job.trails_processed) * 100)}%
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrailImportRecovery;
