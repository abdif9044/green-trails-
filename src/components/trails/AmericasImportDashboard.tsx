
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Play, Pause, RotateCcw, Globe, MapPin, TrendingUp } from 'lucide-react';

interface ImportProgress {
  total_target: number;
  total_imported: number;
  us_imported: number;
  canada_imported: number;
  mexico_imported: number;
  other_americas_imported: number;
  completion_percentage: number;
}

interface BulkJob {
  id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  total_trails_requested: number;
  trails_processed: number;
  trails_added: number;
  trails_failed: number;
  config: any;
  results: any;
}

const AmericasImportDashboard: React.FC = () => {
  const [progress, setProgress] = useState<ImportProgress | null>(null);
  const [activeJob, setActiveJob] = useState<BulkJob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchProgress = async () => {
    try {
      // Get current progress from function
      const { data: progressData, error: progressError } = await supabase
        .rpc('get_americas_import_progress');

      if (progressError) {
        console.error('Error fetching progress:', progressError);
      } else if (progressData && Array.isArray(progressData) && progressData.length > 0) {
        setProgress(progressData[0]);
      }

      // Get active jobs
      const { data: jobData, error: jobError } = await supabase
        .from('bulk_import_jobs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(1);

      if (jobError) {
        console.error('Error fetching jobs:', jobError);
      } else if (jobData && jobData.length > 0) {
        setActiveJob(jobData[0]);
      }
    } catch (error) {
      console.error('Error in fetchProgress:', error);
    }
  };

  useEffect(() => {
    fetchProgress();
    const interval = setInterval(fetchProgress, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const startAmericasImport = async () => {
    setIsLoading(true);
    try {
      toast({
        title: "Starting Americas Import",
        description: "Initializing automated import of 33,333 trails across the Americas...",
      });

      const { data, error } = await supabase.functions.invoke('import-americas-trails', {
        body: {
          target: 33333,
          concurrency: 6,
          batchSize: 500,
          regions: ['United States', 'Canada', 'Mexico', 'South America'],
          autoStart: true
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        toast({
          title: "Import Started Successfully! 🚀",
          description: `Job ID: ${data.job_id}. Importing ${data.target} trails across the Americas.`,
        });
        fetchProgress(); // Immediate refresh
      } else {
        throw new Error(data?.error || 'Failed to start import');
      }
    } catch (error) {
      console.error('Error starting import:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to start Americas import",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'processing': 'default',
      'completed': 'secondary',
      'error': 'destructive',
      'queued': 'outline'
    } as const;
    
    const variant = variants[status as keyof typeof variants] || 'outline';
    
    return (
      <Badge variant={variant}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const formatNumber = (num: number) => num.toLocaleString();
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Globe className="h-8 w-8 text-green-600" />
            Americas Trail Import Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Automated import system for 33,333 trails across North and South America
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={startAmericasImport} 
            disabled={isLoading || activeJob?.status === 'processing'}
            className="bg-green-600 hover:bg-green-700"
          >
            <Play className="h-4 w-4 mr-2" />
            {isLoading ? 'Starting...' : 'Start Import'}
          </Button>
          <Button 
            variant="outline" 
            onClick={fetchProgress}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          {progress ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {formatNumber(progress.total_imported)} / {formatNumber(progress.total_target)} trails
                </span>
                <span className="text-2xl font-bold text-green-600">
                  {progress.completion_percentage}%
                </span>
              </div>
              <Progress value={progress.completion_percentage} className="h-3" />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatNumber(progress.us_imported)}
                  </div>
                  <div className="text-sm text-muted-foreground">United States</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {formatNumber(progress.canada_imported)}
                  </div>
                  <div className="text-sm text-muted-foreground">Canada</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formatNumber(progress.mexico_imported)}
                  </div>
                  <div className="text-sm text-muted-foreground">Mexico</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatNumber(progress.other_americas_imported)}
                  </div>
                  <div className="text-sm text-muted-foreground">South America</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-muted-foreground">Loading progress data...</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Job Status */}
      {activeJob && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Current Import Job
              </span>
              {getStatusBadge(activeJob.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium">Job ID</div>
                <div className="text-xs text-muted-foreground font-mono">
                  {activeJob.id}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Started</div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(activeJob.started_at)}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Target</div>
                <div className="text-xs text-muted-foreground">
                  {formatNumber(activeJob.total_trails_requested)} trails
                </div>
              </div>
            </div>

            {activeJob.status === 'processing' && (
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>
                    {formatNumber(activeJob.trails_added)} added, {formatNumber(activeJob.trails_failed)} failed
                  </span>
                </div>
                <Progress 
                  value={(activeJob.trails_processed / activeJob.total_trails_requested) * 100} 
                  className="mt-2" 
                />
              </div>
            )}

            {activeJob.status === 'completed' && activeJob.results && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-green-800 mb-2">Import Completed Successfully!</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>Success Rate: <span className="font-medium">{activeJob.results.success_rate}%</span></div>
                  <div>Final Count: <span className="font-medium">{formatNumber(activeJob.results.final_count)}</span></div>
                  <div>Added: <span className="font-medium">{formatNumber(activeJob.trails_added)}</span></div>
                  <div>Failed: <span className="font-medium">{formatNumber(activeJob.trails_failed)}</span></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Import Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Target Distribution</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• United States: 15,000 trails (45%)</li>
                <li>• Canada: 8,000 trails (24%)</li>
                <li>• Mexico: 5,333 trails (16%)</li>
                <li>• South America: 5,000 trails (15%)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Processing Details</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 6 concurrent regional workers</li>
                <li>• 500 trails per batch</li>
                <li>• Automated error recovery</li>
                <li>• Real-time progress monitoring</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AmericasImportDashboard;
