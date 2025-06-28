
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Download, MapPin, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { MassiveTrailImportService } from '@/services/trail-import/massive-import-service';
import { useToast } from '@/hooks/use-toast';

interface ImportStatus {
  jobId: string;
  status: 'idle' | 'starting' | 'processing' | 'completed' | 'error';
  progress: number;
  totalProcessed: number;
  totalAdded: number;
  totalFailed: number;
  currentTrailCount: number;
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
  
  const { toast } = useToast();

  const startMassiveImport = async () => {
    setImportStatus(prev => ({ ...prev, status: 'starting' }));
    
    try {
      // Get current trail count
      const currentCount = await MassiveTrailImportService.getTrailCount();
      setImportStatus(prev => ({ ...prev, currentTrailCount: currentCount }));

      // Start the massive import
      const result = await MassiveTrailImportService.quickStart50KTrails();
      
      if (result.success) {
        setImportStatus(prev => ({
          ...prev,
          jobId: result.jobId,
          status: 'processing'
        }));
        
        toast({
          title: "Import Started!",
          description: "Importing 50,000+ trails from multiple sources. This may take several minutes.",
        });
        
        // Start polling for progress
        pollProgress(result.jobId);
      } else {
        setImportStatus(prev => ({ ...prev, status: 'error' }));
        toast({
          title: "Import Failed",
          description: "Failed to start the massive trail import. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error starting import:', error);
      setImportStatus(prev => ({ ...prev, status: 'error' }));
      toast({
        title: "Import Error",
        description: "An unexpected error occurred while starting the import.",
        variant: "destructive"
      });
    }
  };

  const pollProgress = async (jobId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const progress = await MassiveTrailImportService.getImportProgress(jobId);
        const currentCount = await MassiveTrailImportService.getTrailCount();
        
        if (progress) {
          const progressPercent = progress.totalProcessed > 0 
            ? Math.min((progress.totalAdded / 50000) * 100, 100)
            : 0;
            
          setImportStatus({
            jobId: progress.jobId,
            status: progress.status === 'completed' ? 'completed' : 'processing',
            progress: progressPercent,
            totalProcessed: progress.totalProcessed,
            totalAdded: progress.totalAdded,
            totalFailed: progress.totalFailed,
            currentTrailCount: currentCount
          });

          if (progress.status === 'completed' || progress.status === 'error') {
            clearInterval(pollInterval);
            
            if (progress.status === 'completed') {
              toast({
                title: "Import Completed!",
                description: `Successfully imported ${progress.totalAdded.toLocaleString()} trails!`,
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

  const isImporting = importStatus.status === 'starting' || importStatus.status === 'processing';

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-greentrail-600" />
          Massive Trail Import
        </CardTitle>
        <CardDescription>
          Import 50,000+ real trails from Hiking Project, OpenStreetMap, and USGS sources
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {importStatus.currentTrailCount > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Current database contains {importStatus.currentTrailCount.toLocaleString()} trails
            </AlertDescription>
          </Alert>
        )}

        {isImporting && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Import Progress</span>
              <span>{importStatus.totalAdded.toLocaleString()} / 50,000 trails</span>
            </div>
            <Progress value={importStatus.progress} className="w-full" />
            <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>Processed: {importStatus.totalProcessed.toLocaleString()}</div>
              <div>Added: {importStatus.totalAdded.toLocaleString()}</div>
              <div>Failed: {importStatus.totalFailed.toLocaleString()}</div>
            </div>
          </div>
        )}

        {importStatus.status === 'completed' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Successfully imported {importStatus.totalAdded.toLocaleString()} trails! 
              Total trails in database: {importStatus.currentTrailCount.toLocaleString()}
            </AlertDescription>
          </Alert>
        )}

        {importStatus.status === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Import failed. Please check your connection and try again.
            </AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={startMassiveImport}
          disabled={isImporting}
          className="w-full bg-greentrail-600 hover:bg-greentrail-700"
          size="lg"
        >
          {getStatusIcon()}
          {importStatus.status === 'idle' && 'Import 50,000+ Trails'}
          {importStatus.status === 'starting' && 'Starting Import...'}
          {importStatus.status === 'processing' && 'Importing Trails...'}
          {importStatus.status === 'completed' && 'Import Completed'}
          {importStatus.status === 'error' && 'Retry Import'}
        </Button>

        <div className="text-xs text-muted-foreground">
          This will import trail data from multiple sources including Hiking Project, 
          OpenStreetMap, and USGS. The process may take 10-15 minutes to complete.
        </div>
      </CardContent>
    </Card>
  );
};

export default MassiveImportButton;
