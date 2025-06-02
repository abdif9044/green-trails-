
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
  RefreshCw,
  Bug,
  Zap
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
  const [diagnostics, setDiagnostics] = useState<{ hasPermissions: boolean; errors: string[] } | null>(null);
  const { toast } = useToast();

  // Check bootstrap status on mount
  useEffect(() => {
    checkBootstrapStatus();
    
    // Set up polling for progress updates
    const interval = setInterval(updateProgress, 3000);
    return () => clearInterval(interval);
  }, []);

  const checkBootstrapStatus = async () => {
    try {
      setIsLoading(true);
      
      // Run diagnostics first
      const diagResult = await autoBootstrapService.runDiagnostics();
      setDiagnostics(diagResult);
      
      if (!diagResult.hasPermissions) {
        console.error('❌ Database permission issues:', diagResult.errors);
        toast({
          title: "🚨 Database Issues Detected",
          description: `Permission problems found: ${diagResult.errors.length} errors`,
          variant: "destructive",
        });
      }
      
      const result = await autoBootstrapService.checkAndBootstrap();
      
      console.log('Enhanced bootstrap check result:', result);
      
      if (result.needed && result.triggered) {
        setBootstrapStatus('active');
        toast({
          title: "🔧 Enhanced Debug Import Started",
          description: `Forcing 30,000 trail downloads with detailed diagnostics. Current: ${result.currentCount}`,
        });
      } else if (result.needed && !result.triggered) {
        setBootstrapStatus('needed');
      } else {
        setBootstrapStatus('complete');
      }
      
      // Update initial progress
      await updateProgress();
      
    } catch (error) {
      console.error('Error checking enhanced bootstrap status:', error);
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

  const handleEnhancedBootstrap = async () => {
    try {
      setIsLoading(true);
      
      toast({
        title: "🔧 Starting Enhanced Debug Import",
        description: "Forcing trail downloads with detailed error reporting...",
      });
      
      const success = await autoBootstrapService.forceBootstrap();
      
      if (success) {
        setBootstrapStatus('active');
        toast({
          title: "🚀 Enhanced Import Active",
          description: "Downloading 30,000 trails with debug diagnostics",
        });
        
        // Start aggressive polling for updates
        const interval = setInterval(updateProgress, 2000);
        setTimeout(() => clearInterval(interval), 600000); // Stop after 10 minutes
      } else {
        toast({
          title: "❌ Enhanced Import Failed",
          description: "Check console for detailed error report",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Enhanced bootstrap error:', error);
      toast({
        title: "💥 Import Error",
        description: "An error occurred during enhanced import",
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
          title: 'Checking System',
          description: 'Running diagnostics...',
          variant: 'secondary' as const,
          icon: <RefreshCw className="h-4 w-4 animate-spin" />
        };
      case 'needed':
        return {
          title: 'Import Required',
          description: 'Need to download 30K trails',
          variant: 'destructive' as const,
          icon: <AlertCircle className="h-4 w-4" />
        };
      case 'active':
        return {
          title: 'Downloading Trails',
          description: 'Enhanced import in progress...',
          variant: 'default' as const,
          icon: <Zap className="h-4 w-4 animate-pulse" />
        };
      case 'complete':
        return {
          title: 'Import Complete',
          description: '30K+ trails loaded',
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
          Enhanced Trail Import System
        </CardTitle>
        <CardDescription>
          Automated 30K trail download with diagnostic reporting
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

        {/* Diagnostics Status */}
        {diagnostics && (
          <div className={`p-3 rounded-lg text-sm ${
            diagnostics.hasPermissions 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <Bug className="h-4 w-4" />
              <span className="font-medium">
                {diagnostics.hasPermissions ? '✅ System Diagnostics: PASSED' : '❌ System Issues Detected'}
              </span>
            </div>
            {!diagnostics.hasPermissions && diagnostics.errors.length > 0 && (
              <div className="text-xs text-red-600 ml-6">
                {diagnostics.errors.slice(0, 2).map((error, i) => (
                  <div key={i}>• {error}</div>
                ))}
              </div>
            )}
          </div>
        )}

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
          <Button 
            onClick={handleEnhancedBootstrap}
            disabled={isLoading}
            className="flex items-center gap-2"
            variant={bootstrapStatus === 'needed' ? 'default' : 'outline'}
          >
            <Zap className="h-4 w-4" />
            {isLoading ? 'Starting...' : 'Force Download 30K Trails'}
          </Button>

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
            <p className="font-medium text-blue-800">🔧 Enhanced Import Active</p>
            <p className="text-blue-600">
              Downloading trails with enhanced debugging. Detailed error reports in console.
              Process may take 5-15 minutes for full dataset.
            </p>
          </div>
        )}

        {bootstrapStatus === 'complete' && (
          <div className="bg-green-50 p-3 rounded-lg text-sm">
            <p className="font-medium text-green-800">✅ Import Complete</p>
            <p className="text-green-600">
              GreenTrails now has {progress.currentCount.toLocaleString()}+ trails loaded and ready!
            </p>
          </div>
        )}

        {bootstrapStatus === 'needed' && (
          <div className="bg-yellow-50 p-3 rounded-lg text-sm">
            <p className="font-medium text-yellow-800">⚠️ Trails Needed</p>
            <p className="text-yellow-600">
              Only {progress.currentCount} trails found. Click "Force Download" to get 30,000+ trails.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
