
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface HealthCheckResult {
  test_name: string;
  success: boolean;
  details: string;
}

export const DatabaseHealthCheck: React.FC = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<HealthCheckResult[]>([]);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const { toast } = useToast();

  const runHealthCheck = async () => {
    setIsChecking(true);
    try {
      // Test database permissions function
      const { data, error } = await supabase.rpc('test_database_permissions');
      
      if (error) {
        console.error('Health check error:', error);
        toast({
          title: "Health Check Failed",
          description: "Could not run database health check",
          variant: "destructive",
        });
        return;
      }

      setResults(data || []);
      setLastCheck(new Date());
      
      const allPassed = data?.every(result => result.success) ?? false;
      toast({
        title: allPassed ? "Health Check Passed" : "Health Check Issues Found",
        description: allPassed ? "All database tests passed" : "Some database tests failed",
        variant: allPassed ? "default" : "destructive",
      });
      
    } catch (error) {
      console.error('Health check exception:', error);
      toast({
        title: "Health Check Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusBadge = (success: boolean) => {
    return (
      <Badge variant={success ? "default" : "destructive"}>
        {success ? "Pass" : "Fail"}
      </Badge>
    );
  };

  const overallStatus = results.length > 0 ? results.every(r => r.success) : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            <CardTitle>Database Health Check</CardTitle>
          </div>
          {overallStatus !== null && (
            <div className="flex items-center gap-2">
              {overallStatus ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              )}
              <Badge variant={overallStatus ? "default" : "destructive"}>
                {overallStatus ? "Healthy" : "Issues"}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Button 
            onClick={runHealthCheck} 
            disabled={isChecking}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Checking...' : 'Run Health Check'}
          </Button>
          
          {lastCheck && (
            <p className="text-sm text-muted-foreground">
              Last checked: {lastCheck.toLocaleTimeString()}
            </p>
          )}
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Test Results</h4>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.success)}
                    <div>
                      <p className="font-medium capitalize">
                        {result.test_name.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {result.details}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(result.success)}
                </div>
              ))}
            </div>
          </div>
        )}

        {results.length === 0 && !isChecking && (
          <div className="text-center py-8 text-muted-foreground">
            <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Run a health check to test database connectivity and permissions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
