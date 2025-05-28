
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Rocket, Database, MapPin, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ImportStatus {
  isRunning: boolean;
  jobId?: string;
  progress: number;
  trailsAdded: number;
  trailsProcessed: number;
  trailsFailed: number;
  successRate: number;
  message: string;
  error?: string;
}

const QuickImport10K: React.FC = () => {
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    isRunning: false,
    progress: 0,
    trailsAdded: 0,
    trailsProcessed: 0,
    trailsFailed: 0,
    successRate: 0,
    message: 'Ready to import 10,000 trails'
  });
  const { toast } = useToast();

  const startQuickImport = async () => {
    try {
      setImportStatus(prev => ({
        ...prev,
        isRunning: true,
        progress: 0,
        message: 'Starting 10K trail import...'
      }));

      toast({
        title: "Starting 10K Import",
        description: "Importing 10,000 trails from verified sources...",
      });

      // Trigger bootstrap function for immediate 10K import
      const { data, error } = await supabase.functions.invoke('bootstrap-trail-database', {
        body: {
          immediate: true,
          target: '10K'
        }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        setImportStatus(prev => ({
          ...prev,
          jobId: data.job_id,
          message: data.message || 'Import started successfully'
        }));

        // Start monitoring progress
        if (data.job_id) {
          monitorImportProgress(data.job_id);
        }
      } else {
        throw new Error(data.error || 'Failed to start import');
      }

    } catch (error) {
      console.error('Quick import error:', error);
      setImportStatus(prev => ({
        ...prev,
        isRunning: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Import failed to start'
      }));
      
      toast({
        title: "Import Failed",
        description: "Failed to start 10K trail import. Check console for details.",
        variant: "destructive",
      });
    }
  };

  const monitorImportProgress = async (jobId: string) => {
    const checkProgress = async () => {
      try {
        const { data: job, error } = await supabase
          .from('bulk_import_jobs')
          .select('*')
          .eq('id', jobId)
          .single();

        if (error) {
          console.error('Error checking progress:', error);
          return;
        }

        if (job) {
          const progress = job.total_trails_requested > 0 
            ? Math.round((job.trails_processed / job.total_trails_requested) * 100)
            : 0;

          const successRate = job.trails_processed > 0
            ? Math.round((job.trails_added / job.trails_processed) * 100)
            : 0;

          setImportStatus(prev => ({
            ...prev,
            progress,
            trailsAdded: job.trails_added || 0,
            trailsProcessed: job.trails_processed || 0,
            trailsFailed: job.trails_failed || 0,
            successRate,
            message: job.status === 'completed' 
              ? `Import completed: ${job.trails_added} trails added`
              : job.status === 'error'
              ? 'Import encountered errors'
              : 'Import in progress...'
          }));

          // If completed or error, stop monitoring
          if (job.status === 'completed' || job.status === 'error') {
            setImportStatus(prev => ({
              ...prev,
              isRunning: false
            }));

            if (job.status === 'completed') {
              toast({
                title: "10K Import Complete!",
                description: `Successfully imported ${job.trails_added} trails`,
              });
            }

            return;
          }
        }

        // Continue monitoring if still processing
        setTimeout(checkProgress, 3000);
      } catch (error) {
        console.error('Progress monitoring error:', error);
        setImportStatus(prev => ({
          ...prev,
          isRunning: false,
          error: 'Failed to monitor progress'
        }));
      }
    };

    // Start monitoring
    checkProgress();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-6 w-6 text-greentrail-600" />
          Quick Import: 10,000 Trails
        </CardTitle>
        <CardDescription>
          Immediate import of 10,000 real trails for testing and validation
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Target Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-greentrail-600">10,000</div>
            <div className="text-sm text-gray-600">Target Trails</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-sm text-gray-600">Verified Sources</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">15min</div>
            <div className="text-sm text-gray-600">Est. Time</div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center gap-2">
            <Database className="h-4 w-4" />
            Verified Data Sources
          </h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span>Hiking Project API</span>
              <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span>OpenStreetMap</span>
              <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span>USGS National Map</span>
              <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        {importStatus.isRunning && (
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Import Progress
              </h4>
              <Badge variant="secondary">
                {importStatus.progress}% Complete
              </Badge>
            </div>
            
            <Progress value={importStatus.progress} className="w-full" />
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium">Added</div>
                <div className="text-greentrail-600 font-semibold">
                  {importStatus.trailsAdded.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="font-medium">Processed</div>
                <div>{importStatus.trailsProcessed.toLocaleString()}</div>
              </div>
              <div>
                <div className="font-medium">Success Rate</div>
                <div className="text-blue-600 font-semibold">
                  {importStatus.successRate}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {importStatus.message && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            importStatus.error 
              ? 'bg-red-50 text-red-800' 
              : importStatus.trailsAdded > 0 
              ? 'bg-green-50 text-green-800'
              : 'bg-blue-50 text-blue-800'
          }`}>
            {importStatus.error ? (
              <AlertCircle className="h-4 w-4" />
            ) : importStatus.trailsAdded > 0 ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
            <span className="text-sm">{importStatus.message}</span>
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={startQuickImport}
          disabled={importStatus.isRunning}
          className="w-full"
          size="lg"
        >
          {importStatus.isRunning ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Importing... ({importStatus.progress}%)
            </>
          ) : (
            <>
              <Rocket className="h-5 w-5 mr-2" />
              Start 10K Import Now
            </>
          )}
        </Button>
        
        <div className="text-xs text-gray-500 text-center">
          Imports 10,000 real trails from verified sources for immediate testing
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickImport10K;
