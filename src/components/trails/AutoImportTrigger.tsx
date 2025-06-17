
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Rocket, Globe, TrendingUp, Clock } from 'lucide-react';

interface TrailCount {
  count: number;
}

const AutoImportTrigger: React.FC = () => {
  const [trailCount, setTrailCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const { toast } = useToast();

  const TARGET_COUNT = 33333;
  const THRESHOLD = 25000; // Auto-trigger if below this

  const checkTrailCount = async () => {
    try {
      const { count, error } = await supabase
        .from('trails')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error checking trail count:', error);
        return;
      }

      setTrailCount(count || 0);
      setLastChecked(new Date());

      // Auto-trigger if very low
      if ((count || 0) < 1000 && !isLoading) {
        console.log('🎯 Auto-triggering Americas import due to low trail count:', count);
        triggerAmericasImport();
      }
    } catch (error) {
      console.error('Error in checkTrailCount:', error);
    }
  };

  const triggerAmericasImport = async () => {
    setIsLoading(true);
    try {
      toast({
        title: "🚀 Launching Americas Import",
        description: "Starting automated import of 33,333 trails across the Americas...",
      });

      const { data, error } = await supabase.functions.invoke('import-americas-trails', {
        body: {
          target: TARGET_COUNT,
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
          title: "🎉 Import Started Successfully!",
          description: `Job ID: ${data.job_id}. Importing ${TARGET_COUNT.toLocaleString()} trails across the Americas.`,
        });
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

  useEffect(() => {
    checkTrailCount();
    const interval = setInterval(checkTrailCount, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const completionPercentage = Math.min((trailCount / TARGET_COUNT) * 100, 100);
  const needsImport = trailCount < THRESHOLD;

  return (
    <Card className={`${needsImport ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Globe className={`h-5 w-5 ${needsImport ? 'text-orange-600' : 'text-green-600'}`} />
            Americas Trail Database Status
          </span>
          <Badge variant={needsImport ? 'destructive' : 'secondary'}>
            {needsImport ? 'Needs Import' : 'Active'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                {trailCount.toLocaleString()} / {TARGET_COUNT.toLocaleString()} trails
              </span>
              <span className={`text-2xl font-bold ${needsImport ? 'text-orange-600' : 'text-green-600'}`}>
                {completionPercentage.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={completionPercentage} 
              className={`h-3 ${needsImport ? '[&>div]:bg-orange-500' : '[&>div]:bg-green-500'}`} 
            />
          </div>

          {/* Status Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border">
              <TrendingUp className="h-6 w-6 mx-auto mb-1 text-blue-600" />
              <div className="text-lg font-bold">{trailCount.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Current Trails</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <Rocket className="h-6 w-6 mx-auto mb-1 text-purple-600" />
              <div className="text-lg font-bold">{(TARGET_COUNT - trailCount).toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <Clock className="h-6 w-6 mx-auto mb-1 text-gray-600" />
              <div className="text-lg font-bold">
                {lastChecked.toLocaleTimeString()}
              </div>
              <div className="text-xs text-muted-foreground">Last Checked</div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col gap-2">
            {needsImport && (
              <div className="text-sm text-orange-700 bg-orange-100 p-3 rounded-lg">
                <strong>Import Recommended:</strong> The database has fewer than {THRESHOLD.toLocaleString()} trails. 
                Start the Americas import to populate with {TARGET_COUNT.toLocaleString()} trails across North and South America.
              </div>
            )}
            
            <Button 
              onClick={triggerAmericasImport}
              disabled={isLoading}
              className={`w-full ${needsImport ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}`}
              size="lg"
            >
              <Rocket className="h-4 w-4 mr-2" />
              {isLoading ? 'Starting Import...' : 'Import 33,333 Americas Trails'}
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="text-xs text-muted-foreground border-t pt-2">
            <div className="grid grid-cols-2 gap-2">
              <div>Target: 15K US + 8K Canada + 5.3K Mexico + 5K South America</div>
              <div>Processing: 6 workers, 500 trails/batch, ~67 min completion</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoImportTrigger;
