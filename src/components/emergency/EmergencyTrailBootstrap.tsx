
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, CheckCircle, Database, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const EmergencyTrailBootstrap: React.FC = () => {
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState('');
  const { toast } = useToast();

  const startEmergencyBootstrap = async () => {
    setIsBootstrapping(true);
    setProgress(0);
    setCurrentStep('Starting emergency trail bootstrap...');
    
    try {
      toast({
        title: "🚨 Emergency Bootstrap Started",
        description: "Seeding 99+ Midwest trails directly to database",
      });
      
      setCurrentStep('Calling emergency bootstrap function...');
      setProgress(20);
      
      const { data, error } = await supabase.functions.invoke('emergency-trail-bootstrap', {
        body: {
          region: 'midwest',
          trailCount: 150, // Target 150 trails for safety margin
          immediate: true
        }
      });

      if (error) {
        throw error;
      }

      setProgress(80);
      setCurrentStep('Verifying trail count...');
      
      // Wait for function to complete
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check final count
      const { count: finalCount } = await supabase
        .from('trails')
        .select('*', { count: 'exact', head: true });
      
      setProgress(100);
      setCurrentStep('Bootstrap complete!');
      setResults({
        ...data,
        final_count: finalCount
      });
      
      if (finalCount && finalCount > 0) {
        toast({
          title: "✅ Emergency Bootstrap Successful!",
          description: `Database now has ${finalCount} trails! Ready for launch.`,
        });
      } else {
        throw new Error('Bootstrap completed but trail count is still 0');
      }
      
    } catch (error) {
      console.error('Emergency bootstrap failed:', error);
      setCurrentStep('Bootstrap failed');
      toast({
        title: "❌ Emergency Bootstrap Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setIsBootstrapping(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-6 w-6" />
          CRITICAL: Emergency Trail Bootstrap
        </CardTitle>
        <CardDescription className="text-red-600">
          Database has 0 trails. This emergency system will seed 99+ Midwest trails immediately.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isBootstrapping && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{currentStep}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        <Button
          onClick={startEmergencyBootstrap}
          disabled={isBootstrapping}
          className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
          size="lg"
        >
          <Zap className="h-4 w-4" />
          {isBootstrapping ? 'Bootstrapping Database...' : 'EMERGENCY: Seed Midwest Trails'}
        </Button>

        {results && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-700">Bootstrap Successful!</span>
            </div>
            <div className="space-y-1 text-sm text-green-600">
              <div>Trails Added: <span className="font-medium">{results.trails_imported?.toLocaleString()}</span></div>
              <div>Total in Database: <span className="font-medium">{results.final_count?.toLocaleString()}</span></div>
              <div>Status: <span className="font-medium text-green-700">READY FOR LAUNCH</span></div>
            </div>
          </div>
        )}
        
        <div className="text-xs text-gray-600 mt-4">
          <div className="flex items-center gap-2 mb-1">
            <Database className="h-3 w-3" />
            <span>This will seed trails from: Illinois, Wisconsin, Minnesota, Iowa, Missouri</span>
          </div>
          <div>• Realistic coordinates and trail data</div>
          <div>• Proper difficulty levels and lengths</div>
          <div>• Immediate database population</div>
        </div>
      </CardContent>
    </Card>
  );
};
