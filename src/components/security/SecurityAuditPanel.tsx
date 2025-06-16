
import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SupabaseSecurityChecker } from '@/services/security/supabase-security-checker';

interface SecurityCheckResult {
  check: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  recommendation?: string;
}

export const SecurityAuditPanel: React.FC = () => {
  const [results, setResults] = useState<SecurityCheckResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const runSecurityAudit = async () => {
    setLoading(true);
    try {
      const auditResults = await SupabaseSecurityChecker.runSecurityAudit();
      setResults(auditResults);
      setLastCheck(new Date());
    } catch (error) {
      console.error('Security audit failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSecurityAudit();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'fail':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pass: 'default',
      fail: 'destructive',
      warning: 'secondary'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const failedChecks = results.filter(r => r.status === 'fail').length;
  const warningChecks = results.filter(r => r.status === 'warning').length;
  const passedChecks = results.filter(r => r.status === 'pass').length;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Supabase Security Audit
            </CardTitle>
            <CardDescription>
              Comprehensive security check for your Supabase configuration
            </CardDescription>
          </div>
          <Button onClick={runSecurityAudit} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Run Audit
          </Button>
        </div>
        
        {lastCheck && (
          <div className="text-sm text-muted-foreground">
            Last checked: {lastCheck.toLocaleString()}
          </div>
        )}

        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">{passedChecks} Passed</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">{warningChecks} Warnings</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm">{failedChecks} Failed</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
              {getStatusIcon(result.status)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{result.check}</h4>
                  {getStatusBadge(result.status)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{result.message}</p>
                {result.recommendation && (
                  <div className="text-sm p-2 bg-blue-50 dark:bg-blue-950 rounded border-l-4 border-blue-500">
                    <strong>Recommendation:</strong> {result.recommendation}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {failedChecks > 0 && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
              Critical Security Issues Detected
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300">
              Please address the failed security checks above before deploying to production.
              These issues may cause connection problems or security vulnerabilities.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
