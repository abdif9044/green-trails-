
import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SecurityManager } from '@/services/security/security-manager';
import { useAuth } from '@/hooks/use-auth';

interface SecurityStatus {
  overall: 'secure' | 'warning' | 'critical';
  session: 'valid' | 'expiring' | 'invalid';
  environment: 'secure' | 'issues';
  lastCheck: Date;
}

export const SecurityMonitor: React.FC = () => {
  const { user, session } = useAuth();
  const [status, setStatus] = useState<SecurityStatus>({
    overall: 'secure',
    session: 'valid',
    environment: 'secure',
    lastCheck: new Date(),
  });
  const [loading, setLoading] = useState(true);

  const checkSecurityStatus = async () => {
    try {
      setLoading(true);
      
      // Check environment
      const envValidation = await SecurityManager.validateEnvironment();
      const environmentStatus = envValidation.isValid ? 'secure' : 'issues';
      
      // Check session if user is logged in
      let sessionStatus: 'valid' | 'expiring' | 'invalid' = 'invalid';
      if (user && session) {
        const sessionValidation = await SecurityManager.validateSession();
        if (sessionValidation.isValid) {
          sessionStatus = sessionValidation.shouldRefresh ? 'expiring' : 'valid';
        }
      } else if (!user) {
        sessionStatus = 'invalid'; // Not logged in is expected
      }
      
      // Determine overall status
      let overallStatus: 'secure' | 'warning' | 'critical' = 'secure';
      if (environmentStatus === 'issues') {
        overallStatus = 'critical';
      } else if (sessionStatus === 'expiring') {
        overallStatus = 'warning';
      }
      
      setStatus({
        overall: overallStatus,
        session: sessionStatus,
        environment: environmentStatus,
        lastCheck: new Date(),
      });
    } catch (error) {
      console.error('Security status check failed:', error);
      setStatus(prev => ({
        ...prev,
        overall: 'warning',
        lastCheck: new Date(),
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSecurityStatus();
    
    // Check security status every 5 minutes
    const interval = setInterval(checkSecurityStatus, 300000);
    
    return () => clearInterval(interval);
  }, [user, session]);

  const getOverallIcon = () => {
    switch (status.overall) {
      case 'secure':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (statusType: string) => {
    const variants = {
      secure: 'default',
      valid: 'default',
      warning: 'secondary',
      expiring: 'secondary',
      issues: 'destructive',
      critical: 'destructive',
      invalid: 'outline',
    } as const;

    return (
      <Badge variant={variants[statusType as keyof typeof variants] || 'outline'}>
        {statusType.toUpperCase()}
      </Badge>
    );
  };

  if (!user) {
    return null; // Don't show security monitor for non-authenticated users
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          {getOverallIcon()}
          Security Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Overall</span>
          {getStatusBadge(status.overall)}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Session</span>
          {getStatusBadge(status.session)}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Environment</span>
          {getStatusBadge(status.environment)}
        </div>
        
        <div className="text-xs text-muted-foreground mt-3">
          Last checked: {status.lastCheck.toLocaleTimeString()}
        </div>
        
        {status.overall !== 'secure' && (
          <div className="text-xs text-destructive mt-2">
            {status.overall === 'critical' && 'Critical security issues detected'}
            {status.overall === 'warning' && 'Some security concerns need attention'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
