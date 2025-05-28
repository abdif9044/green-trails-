
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAutoTrailBootstrap } from '@/hooks/use-auto-trail-bootstrap';
import { Database, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

const AutoBootstrapStatus: React.FC = () => {
  const { status } = useAutoTrailBootstrap();

  // Don't show anything if bootstrap is complete and no errors
  if (status.isComplete && !status.error) {
    return null;
  }

  // Don't show during initial bootstrap check
  if (!status.isBootstrapping && !status.error && !status.message) {
    return null;
  }

  return (
    <Card className="mb-6 border-greentrail-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-greentrail-600" />
          30K Trail Database System
        </CardTitle>
        <CardDescription>
          Automatically managing 30,000 trail database population
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {status.isBootstrapping && (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  <Badge variant="secondary">Initializing 30K Database</Badge>
                </>
              )}
              
              {status.error && (
                <>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <Badge variant="destructive">Error</Badge>
                </>
              )}
              
              {!status.isBootstrapping && !status.error && status.message && (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <Badge variant="default">30K System Active</Badge>
                </>
              )}
            </div>
            
            <div className="text-sm text-gray-600">
              {status.currentTrailCount.toLocaleString()} / {status.targetTrailCount.toLocaleString()} trails
            </div>
          </div>

          {/* Progress */}
          {status.jobId && !status.isComplete && (
            <div className="space-y-2">
              <Progress 
                value={status.progressPercent} 
                className="w-full" 
              />
              <div className="text-xs text-gray-500 text-center">
                Target: 30,000 trails across North America
              </div>
            </div>
          )}

          {/* Status Message */}
          {status.message && (
            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
              {status.message}
            </div>
          )}

          {/* Error Display */}
          {status.error && (
            <div className="text-sm text-red-700 bg-red-50 p-3 rounded-md">
              <strong>Error:</strong> {status.error}
            </div>
          )}

          {/* 30K System Features */}
          {status.currentTrailCount >= 25000 && (
            <div className="text-sm text-green-700 bg-green-50 p-3 rounded-md">
              <strong>30K System Active:</strong> Full coverage across US, Canada, and Mexico with premium trail data
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoBootstrapStatus;
