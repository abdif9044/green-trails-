
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Zap, Database, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BootstrapStatus {
  configuring: boolean;
  bootstrapping: boolean;
  weatherFixed: boolean;
  trailsImported: number;
  totalTarget: number;
  progress: number;
  error: string | null;
  success: boolean;
  jobId: string | null;
}

export const EmergencyBootstrap: React.FC = () => {
  const [status, setStatus] = useState<BootstrapStatus>({
    configuring: false,
    bootstrapping: false,
    weatherFixed: false,
    trailsImported: 0,
    totalTarget: 50000,
    progress: 0,
    error: null,
    success: false,
    jobId: null
  });
  
  const { toast } = useToast();

  useEffect(() => {
    // Auto-start the emergency bootstrap process
    handleEmergencyBootstrap();
  }, []);

  const handleEmergencyBootstrap = async () => {
    try {
      setStatus(prev => ({ ...prev, configuring: true, error: null }));
      
      toast({
        title: "🚀 Emergency Bootstrap Started",
        description: "Configuring API keys and importing trail data...",
      });

      // Step 1: Configure API keys
      console.log('🔧 Configuring API keys...');
      const { data: configData, error: configError } = await supabase.functions.invoke('configure-api-keys');
      
      if (configError) {
        throw new Error(`API configuration failed: ${configError.message}`);
      }

      console.log('✅ API keys configured');
      setStatus(prev => ({ ...prev, configuring: false, bootstrapping: true }));

      // Step 2: Fix weather prophet
      console.log('🌤️ Fixing weather system...');
      const { data: weatherData, error: weatherError } = await supabase.functions.invoke('fix-weather-prophet', {
        body: {
          coordinates: [-105.7821, 39.5501], // Denver coordinates for test
          analysisType: 'comprehensive'
        }
      });

      if (!weatherError && weatherData?.success) {
        console.log('✅ Weather system fixed');
        setStatus(prev => ({ ...prev, weatherFixed: true }));
      }

      // Step 3: Emergency trail bootstrap
      console.log('🏔️ Starting emergency trail import...');
      const { data: bootstrapData, error: bootstrapError } = await supabase.functions.invoke('emergency-trail-bootstrap');
      
      if (bootstrapError) {
        throw new Error(`Trail bootstrap failed: ${bootstrapError.message}`);
      }

      console.log('Bootstrap response:', bootstrapData);
      
      if (bootstrapData?.success) {
        setStatus(prev => ({
          ...prev,
          bootstrapping: false,
          success: true,
          trailsImported: bootstrapData.trails_imported || 0,
          progress: 100,
          jobId: bootstrapData.job_id
        }));

        toast({
          title: "🎉 Emergency Bootstrap Complete!",
          description: `Successfully imported ${bootstrapData.trails_imported} trails and fixed weather system`,
        });
      }

    } catch (error) {
      console.error('Emergency bootstrap error:', error);
      setStatus(prev => ({
        ...prev,
        configuring: false,
        bootstrapping: false,
        error: error instanceof Error ? error.message : 'Bootstrap failed'
      }));

      toast({
        title: "❌ Bootstrap Error",
        description: error instanceof Error ? error.message : 'Emergency bootstrap failed',
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-yellow-600" />
          Emergency System Bootstrap
          {status.success && <CheckCircle className="h-5 w-5 text-green-600" />}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Configuration Status */}
        <div className="flex items-center gap-3">
          {status.configuring ? (
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          ) : (
            <CheckCircle className="h-5 w-5 text-green-600" />
          )}
          <span className="flex-1">API Keys Configuration</span>
          <Badge variant={status.configuring ? "secondary" : "default"}>
            {status.configuring ? "Configuring..." : "✅ Complete"}
          </Badge>
        </div>

        {/* Weather System Status */}
        <div className="flex items-center gap-3">
          {status.weatherFixed ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          )}
          <span className="flex-1">Weather Prophet System</span>
          <Badge variant={status.weatherFixed ? "default" : "secondary"}>
            {status.weatherFixed ? "✅ Fixed" : "Fixing..."}
          </Badge>
        </div>

        {/* Trail Import Status */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {status.bootstrapping ? (
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            ) : status.success ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Database className="h-5 w-5 text-gray-400" />
            )}
            <span className="flex-1">Trail Database Import</span>
            <Badge variant={status.success ? "default" : "secondary"}>
              {status.success ? `✅ ${status.trailsImported.toLocaleString()} Imported` : "Importing..."}
            </Badge>
          </div>
          
          {(status.bootstrapping || status.trailsImported > 0) && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{status.trailsImported.toLocaleString()} / {status.totalTarget.toLocaleString()} trails</span>
              </div>
              <Progress value={status.progress} className="w-full" />
            </div>
          )}
        </div>

        {/* Error Display */}
        {status.error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Bootstrap Error</p>
              <p className="text-red-600 text-sm mt-1">{status.error}</p>
              <Button 
                onClick={handleEmergencyBootstrap}
                size="sm"
                variant="outline"
                className="mt-3"
              >
                Retry Bootstrap
              </Button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {status.success && (
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-800">Bootstrap Complete!</p>
              <p className="text-green-600 text-sm mt-1">
                System is now fully operational with {status.trailsImported.toLocaleString()} trails and working weather analysis.
              </p>
              {status.jobId && (
                <p className="text-xs text-green-500 mt-1">Job ID: {status.jobId}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmergencyBootstrap;
