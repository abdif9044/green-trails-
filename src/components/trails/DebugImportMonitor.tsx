
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { 
  Bug, 
  Database, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  Activity
} from 'lucide-react';

interface DebugStatus {
  trailCount: number;
  activeJobs: any[];
  lastImportResult: any;
  systemHealth: 'good' | 'warning' | 'error';
  errorDetails: string[];
}

const DebugImportMonitor: React.FC = () => {
  const [debugStatus, setDebugStatus] = useState<DebugStatus>({
    trailCount: 0,
    activeJobs: [],
    lastImportResult: null,
    systemHealth: 'good',
    errorDetails: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDebugging, setIsDebugging] = useState(false);

  const fetchDebugStatus = async () => {
    setIsLoading(true);
    try {
      // Get current trail count
      const { count: trailCount } = await supabase
        .from('trails')
        .select('*', { count: 'exact', head: true });

      // Get active import jobs
      const { data: activeJobs } = await supabase
        .from('bulk_import_jobs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(5);

      // Get recent individual import jobs for error analysis
      const { data: recentJobs } = await supabase
        .from('trail_import_jobs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(10);

      const errorDetails: string[] = [];
      let systemHealth: 'good' | 'warning' | 'error' = 'good';

      // Analyze system health
      if ((trailCount || 0) < 100) {
        systemHealth = 'error';
        errorDetails.push('Critical: Trail count extremely low (under 100 trails)');
      } else if ((trailCount || 0) < 5000) {
        systemHealth = 'warning';
        errorDetails.push('Warning: Trail count below target threshold (under 5,000 trails)');
      }

      // Check for failed imports
      const failedJobs = activeJobs?.filter(job => job.status === 'error') || [];
      if (failedJobs.length > 0) {
        systemHealth = 'error';
        errorDetails.push(`${failedJobs.length} import jobs failed`);
      }

      // Check for stalled imports
      const stalledJobs = activeJobs?.filter(job => 
        job.status === 'processing' && 
        new Date().getTime() - new Date(job.started_at).getTime() > 3600000 // 1 hour
      ) || [];
      
      if (stalledJobs.length > 0) {
        systemHealth = 'warning';
        errorDetails.push(`${stalledJobs.length} import jobs appear stalled`);
      }

      setDebugStatus({
        trailCount: trailCount || 0,
        activeJobs: activeJobs || [],
        lastImportResult: activeJobs?.[0] || null,
        systemHealth,
        errorDetails
      });

    } catch (error) {
      console.error('Error fetching debug status:', error);
      setDebugStatus(prev => ({
        ...prev,
        systemHealth: 'error',
        errorDetails: ['Failed to fetch system status']
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const startDebugImport = async () => {
    setIsDebugging(true);
    try {
      console.log('🔧 Starting debug import...');
      
      const { data, error } = await supabase.functions.invoke('bootstrap-trail-database');
      
      if (error) {
        throw error;
      }
      
      console.log('Debug import started:', data);
      
      // Refresh status after starting import
      setTimeout(() => {
        fetchDebugStatus();
      }, 2000);
      
    } catch (error) {
      console.error('Failed to start debug import:', error);
    } finally {
      setIsDebugging(false);
    }
  };

  useEffect(() => {
    fetchDebugStatus();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDebugStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getHealthIcon = () => {
    switch (debugStatus.systemHealth) {
      case 'good':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  const getHealthBadge = () => {
    switch (debugStatus.systemHealth) {
      case 'good':
        return <Badge variant="default" className="bg-green-100 text-green-800">System Healthy</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Needs Attention</Badge>;
      case 'error':
        return <Badge variant="destructive">System Error</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Debug Header */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-orange-600" />
            Trail Import Debug Monitor
          </CardTitle>
          <CardDescription>
            Real-time monitoring and debugging for the 30K trail import system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getHealthIcon()}
              {getHealthBadge()}
              <div className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchDebugStatus}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={startDebugImport}
                disabled={isDebugging}
              >
                {isDebugging ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Activity className="h-4 w-4" />
                )}
                Debug Import
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-3xl font-bold text-greentrail-600">
                {debugStatus.trailCount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total trails in database</div>
              <div className="mt-2">
                <Progress 
                  value={Math.min((debugStatus.trailCount / 30000) * 100, 100)} 
                  className="w-full" 
                />
                <div className="text-xs text-gray-500 mt-1">
                  Target: 30,000 trails ({Math.round((debugStatus.trailCount / 30000) * 100)}% complete)
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-lg font-semibold">Active Import Jobs</div>
              <div className="text-sm text-gray-600 mb-2">
                {debugStatus.activeJobs.length} jobs tracked
              </div>
              {debugStatus.activeJobs.slice(0, 3).map((job, index) => (
                <div key={job.id} className="text-sm border-l-2 pl-3 mb-2 border-gray-200">
                  <div className="font-medium">Job {job.id.slice(-8)}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant={job.status === 'completed' ? 'default' : 
                                  job.status === 'error' ? 'destructive' : 'secondary'}>
                      {job.status}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {job.trails_added || 0} trails added
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Details */}
      {debugStatus.errorDetails.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              System Issues Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {debugStatus.errorDetails.map((error, index) => (
                <Alert key={index} variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debug Instructions */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Debug Instructions</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div><strong>Step 1:</strong> Check if trail count is above 5,000. If not, click "Debug Import".</div>
          <div><strong>Step 2:</strong> Monitor import jobs for errors or stalled status.</div>
          <div><strong>Step 3:</strong> If imports fail, check browser console and Supabase logs.</div>
          <div><strong>Step 4:</strong> Verify API keys are configured in Supabase environment.</div>
          <div><strong>Step 5:</strong> Test individual data sources if needed.</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugImportMonitor;
