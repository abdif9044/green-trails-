
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Download, 
  CheckCircle, 
  PlayCircle, 
  AlertCircle,
  RefreshCw 
} from 'lucide-react';
import { autoBootstrapService } from '@/services/trail-import/auto-bootstrap-service';
import { useToast } from '@/hooks/use-toast';

export default function AutoBootstrapStatus() {
  const [progress, setProgress] = useState({
    isActive: false,
    currentCount: 0,
    targetCount: 30000,
    progressPercent: 0
  });
  const [bootstrapStatus, setBootstrapStatus] = useState<'checking' | 'needed' | 'complete' | 'active'>('checking');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check bootstrap status on mount
  useEffect(() => {
    checkBootstrapStatus();
    
    // Set up polling for progress updates
    const interval = setInterval(updateProgress, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkBootstrapStatus = async () => {
    try {
      setIsLoading(true);
      const result = await autoBootstrapService.checkAndBootstrap();
      
      console.log('Bootstrap check result:', result);
      
      if (result.needed && result.triggered) {
        setBootstrapStatus('active');
        toast({
          title: "🚀 Auto-Bootstrap Started",
          description: `Loading 30,000 trails automatically. Current: ${result.currentCount}`,
        });
      } else if (result.needed && !result.triggered) {
        setBootstrapStatus('needed');
      } else {
        setBootstrapStatus('complete');
      }
      
      // Update initial progress
      await updateProgress();
      
    } catch (error) {
      console.error('Error checking bootstrap status:', error);
      setBootstrapStatus('needed');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgress = async () => {
    try {
      const progressData = await autoBootstrapService.getBootstrapProgress();
      setProgress(progressData);
      
      // Update status based on progress
      if (progressData.isActive) {
        setBootstrapStatus('active');
      } else if (progressData.currentCount >= 25000) {
        setBootstrapStatus('complete');
      } else if (progressData.currentCount < 5000) {
        setBootstrapStatus('needed');
      }
      
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleManualBootstrap = async () => {
    try {
      setIsLoading(true);
      const success = await autoBootstrapService.forceBootstrap();
      
      if (success) {
        setBootstrapStatus('active');
        toast({
          title: "🚀 Manual Bootstrap Started",
          description: "Loading 30,000 trails manually initiated",
        });
        
        // Start polling for updates
        const interval = setInterval(updateProgress, 3000);
        setTimeout(() => clearInterval(interval), 300000); // Stop after 5 minutes
      } else {
        toast({
          title: "❌ Bootstrap Failed",
          description: "Could not start the trail loading process",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Manual bootstrap error:', error);
      toast({
        title: "💥 Bootstrap Error",
        description: "An error occurred during manual bootstrap",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusInfo = () => {
    switch (bootstrapStatus) {
      case 'checking':
        return {
          title: 'Checking Trail Database',
          description: 'Verifying current trail count...',
          variant: 'secondary' as const,
          icon: <RefreshCw className="h-4 w-4 animate-spin" />
        };
      case 'needed':
        return {
          title: 'Bootstrap Required',
          description: 'Trail database needs 30K preload',
          variant: 'destructive' as const,
          icon: <AlertCircle className="h-4 w-4" />
        };
      case 'active':
        return {
          title: 'Loading Trails',
          description: 'Auto-importing 30,000 trails...',
          variant: 'default' as const,
          icon: <PlayCircle className="h-4 w-4 animate-pulse" />
        };
      case 'complete':
        return {
          title: 'Bootstrap Complete',
          description: '30K+ trails loaded successfully',
          variant: 'default' as const,
          icon: <CheckCircle className="h-4 w-4" />
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Auto-Bootstrap Status
        </CardTitle>
        <CardDescription>
          Automatic 30K trail preload system for the best user experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <Badge variant={statusInfo.variant} className="flex items-center gap-2">
            {statusInfo.icon}
            {statusInfo.title}
          </Badge>
          <span className="text-sm text-gray-600">{statusInfo.description}</span>
        </div>

        {/* Progress Section */}
        {bootstrapStatus !== 'checking' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Current Trails: {progress.currentCount.toLocaleString()}</span>
              <span>Target: {progress.targetCount.toLocaleString()}</span>
            </div>
            <Progress 
              value={progress.progressPercent} 
              className="w-full"
            />
            <div className="text-xs text-gray-500 text-right">
              {progress.progressPercent}% complete
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {bootstrapStatus === 'needed' && (
            <Button 
              onClick={handleManualBootstrap}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isLoading ? 'Starting...' : 'Start 30K Bootstrap'}
            </Button>
          )}

          <Button 
            variant="outline" 
            onClick={updateProgress}
            disabled={isLoading}
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Current Status Details */}
        {bootstrapStatus === 'active' && (
          <div className="bg-blue-50 p-3 rounded-lg text-sm">
            <p className="font-medium text-blue-800">🚀 Bootstrap In Progress</p>
            <p className="text-blue-600">
              Loading trails from multiple sources. This may take 5-10 minutes.
              The page will update automatically as trails are imported.
            </p>
          </div>
        )}

        {bootstrapStatus === 'complete' && (
          <div className="bg-green-50 p-3 rounded-lg text-sm">
            <p className="font-medium text-green-800">✅ Bootstrap Complete</p>
            <p className="text-green-600">
              GreenTrails now has {progress.currentCount.toLocaleString()}+ trails loaded and ready to explore!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
