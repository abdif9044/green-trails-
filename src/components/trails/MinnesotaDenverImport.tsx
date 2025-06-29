
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Zap, 
  CheckCircle, 
  Loader2, 
  AlertTriangle,
  TreePine,
  Mountain
} from 'lucide-react';
import { MinnesotaDenverImportService } from '@/services/trail-import/minnesota-denver-import-service';
import { useToast } from '@/hooks/use-toast';

const MinnesotaDenverImport: React.FC = () => {
  const [importing, setImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<{
    totalTrails: number;
    minnesotaTrails: number;
    denverTrails: number;
  }>({ totalTrails: 0, minnesotaTrails: 0, denverTrails: 0 });
  const { toast } = useToast();

  useEffect(() => {
    // Load current status on mount
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const statusData = await MinnesotaDenverImportService.getImportStatus();
      setStatus(statusData);
    } catch (error) {
      console.error('Error loading status:', error);
    }
  };

  const handleImport = async () => {
    setImporting(true);
    setProgress(0);
    
    try {
      toast({
        title: "Starting Import",
        description: "Importing 666 trails from Minnesota and Denver areas...",
      });

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.random() * 15;
        });
      }, 2000);

      const success = await MinnesotaDenverImportService.import666Trails();
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (success) {
        setImportComplete(true);
        toast({
          title: "Import Successful!",
          description: "Successfully imported 666 trails from Minnesota and Denver.",
        });
        
        // Reload status
        await loadStatus();
      } else {
        toast({
          title: "Import Issues",
          description: "Import completed with some issues. Check the logs for details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: "Failed to complete the trail import. Please try again.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Import Control Card */}
      <Card className="border-2 border-greentrail-200 dark:border-greentrail-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-greentrail-600" />
            666 Trails Import
          </CardTitle>
          <CardDescription>
            Import exactly 666 trails from Minnesota and Denver areas using production API keys
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <TreePine className="h-4 w-4 text-green-600" />
              <span className="text-sm">Minnesota: 333 trails</span>
            </div>
            <div className="flex items-center gap-2">
              <Mountain className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Denver: 333 trails</span>
            </div>
          </div>

          {importing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Import Progress</span>
                <Badge variant="secondary">{Math.round(progress)}%</Badge>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {importComplete ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>Import completed successfully!</span>
            </div>
          ) : (
            <Button
              onClick={handleImport}
              disabled={importing}
              className="w-full bg-greentrail-600 hover:bg-greentrail-700"
            >
              {importing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Importing 666 Trails...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Start 666 Trails Import
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-greentrail-600" />
            Current Status
          </CardTitle>
          <CardDescription>
            Trail database statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-greentrail-600">
                  {status.totalTrails.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Trails</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {status.minnesotaTrails.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Minnesota</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {status.denverTrails.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Colorado</div>
              </div>
            </div>

            <Button
              onClick={loadStatus}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Refresh Status
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MinnesotaDenverImport;
