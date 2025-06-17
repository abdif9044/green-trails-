
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Play, RotateCcw, CheckCircle, AlertCircle, Globe } from 'lucide-react';

interface ImportProgress {
  job_id?: string;
  success?: boolean;
  total_processed?: number;
  total_added?: number;
  total_failed?: number;
  success_rate?: number;
  final_database_count?: number;
  regional_distribution?: Record<string, number>;
}

const MassiveImportButton: React.FC = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState<ImportProgress | null>(null);
  const [currentTrailCount, setCurrentTrailCount] = useState(0);
  const { toast } = useToast();

  const fetchCurrentTrailCount = async () => {
    try {
      const { count } = await supabase
        .from('trails')
        .select('*', { count: 'exact', head: true });
      setCurrentTrailCount(count || 0);
    } catch (error) {
      console.error('Error fetching trail count:', error);
    }
  };

  useEffect(() => {
    fetchCurrentTrailCount();
  }, []);

  const startMassiveImport = async () => {
    setIsImporting(true);
    setProgress(null);
    
    try {
      toast({
        title: "🚀 Starting Massive Trail Import",
        description: "Importing 33,333 trails across the Americas. This may take several minutes...",
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

      setProgress(data);
      
      if (data?.success) {
        toast({
          title: "🎉 Import Completed Successfully!",
          description: `Added ${data.total_added?.toLocaleString()} trails. Database now has ${data.final_database_count?.toLocaleString()} total trails.`,
        });
        
        // Refresh trail count
        await fetchCurrentTrailCount();
      } else {
        throw new Error(data?.error || 'Import failed');
      }
    } catch (error) {
      console.error('Error starting massive import:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to start massive trail import",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const formatNumber = (num: number) => num.toLocaleString();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Import Card */}
      <Card className="border-2 border-greentrail-200">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            <Globe className="h-8 w-8 text-greentrail-600" />
            33,333 Americas Trail Import
          </CardTitle>
          <p className="text-muted-foreground">
            Import a massive database of trails across North and South America
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-3xl font-bold text-greentrail-600">
              {formatNumber(currentTrailCount)}
            </div>
            <div className="text-sm text-muted-foreground">
              Current trails in database
            </div>
          </div>

          {/* Import Button */}
          <div className="flex justify-center">
            <Button 
              onClick={startMassiveImport}
              disabled={isImporting}
              size="lg"
              className="bg-greentrail-600 hover:bg-greentrail-700 text-white px-8 py-3"
            >
              {isImporting ? (
                <>
                  <RotateCcw className="mr-2 h-5 w-5 animate-spin" />
                  Importing 33,333 Trails...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Start Massive Import
                </>
              )}
            </Button>
          </div>

          {/* Progress Results */}
          {progress && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {progress.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  Import Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatNumber(progress.total_added || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Added</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatNumber(progress.total_processed || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Processed</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {progress.success_rate || 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {formatNumber(progress.final_database_count || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total in DB</div>
                  </div>
                </div>

                {progress.success && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
                      <CheckCircle className="h-4 w-4" />
                      Import Completed Successfully!
                    </div>
                    <p className="text-green-700 text-sm">
                      Your GreenTrails database now has {formatNumber(progress.final_database_count || 0)} trails 
                      available for users to explore across the Americas.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Regional Distribution Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 border rounded-lg">
              <div className="font-semibold text-blue-600">United States</div>
              <div className="text-muted-foreground">15,000 trails (45%)</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="font-semibold text-red-600">Canada</div>
              <div className="text-muted-foreground">8,000 trails (24%)</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="font-semibold text-green-600">Mexico</div>
              <div className="text-muted-foreground">5,333 trails (16%)</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="font-semibold text-purple-600">South America</div>
              <div className="text-muted-foreground">5,000 trails (15%)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle>What You'll Get</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-greentrail-700 mb-2">Trail Diversity</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Mountain peaks and forest paths</li>
                <li>• Desert trails and coastal routes</li>
                <li>• Easy walks to expert challenges</li>
                <li>• Urban trails and wilderness adventures</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-greentrail-700 mb-2">Complete Data</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• GPS coordinates and elevation profiles</li>
                <li>• Difficulty ratings and trail lengths</li>
                <li>• Regional categorization</li>
                <li>• Ready for mobile app usage</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MassiveImportButton;
