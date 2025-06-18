
import React, { useState } from 'react';
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
  Zap,
  Play
} from 'lucide-react';

const DatabaseEmergencyFix: React.FC = () => {
  const [isFixing, setIsFixing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const emergencyPopulateDatabase = async () => {
    setIsFixing(true);
    setProgress(0);
    setCurrentStep('Starting emergency database population...');
    
    try {
      setCurrentStep('Calling fixed import function...');
      setProgress(20);
      
      const { data, error } = await supabase.functions.invoke('import-trails-massive', {
        body: {
          sources: ['hiking_project', 'openstreetmap'],
          maxTrailsPerSource: 2500, // 5,000 total trails
          batchSize: 25,
          target: 'Emergency 5K Launch Fix'
        }
      });

      if (error) {
        throw error;
      }

      setProgress(60);
      setCurrentStep('Import function completed, verifying results...');
      
      // Wait a moment for the function to complete
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check final database count
      const { count: finalCount } = await supabase
        .from('trails')
        .select('*', { count: 'exact', head: true });
      
      setProgress(100);
      setCurrentStep('Database population complete!');
      setResults({
        ...data,
        final_count: finalCount
      });
      
      if (data.trails_added > 0) {
        toast({
          title: "Emergency fix successful!",
          description: `Added ${data.trails_added} trails to the database. Your app now has content!`,
        });
      } else {
        throw new Error(`Import completed but only added ${data.trails_added} trails`);
      }
      
    } catch (error) {
      console.error('Emergency fix failed:', error);
      setCurrentStep('Emergency fix failed');
      toast({
        title: "Emergency fix failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <AlertTriangle className="h-5 w-5" />
            CRITICAL: Empty Database
          </CardTitle>
          <CardDescription className="text-red-600 dark:text-red-400">
            Your app has ZERO trails in the database. This is a launch blocker that needs immediate fixing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isFixing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{currentStep}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          <Button
            onClick={emergencyPopulateDatabase}
            disabled={isFixing}
            className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            size="lg"
          >
            <Zap className="h-4 w-4" />
            {isFixing ? 'Fixing Database...' : 'EMERGENCY FIX: Populate Database'}
          </Button>

          {results && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-700 dark:text-green-300">Fix Completed!</span>
              </div>
              <div className="space-y-1 text-sm text-green-600 dark:text-green-400">
                <div>Trails Added: <span className="font-medium">{results.trails_added?.toLocaleString()}</span></div>
                <div>Success Rate: <span className="font-medium">{results.success_rate}%</span></div>
                <div>Total in Database: <span className="font-medium">{results.final_count?.toLocaleString()}</span></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What This Fix Does</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-greentrail-600" />
              <span>Populates database with 5,000 real trail records</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-greentrail-600" />
              <span>Enables map functionality and trail discovery</span>
            </div>
            <div className="flex items-center gap-2">
              <Play className="h-4 w-4 text-greentrail-600" />
              <span>Makes your app immediately usable for testing</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseEmergencyFix;
