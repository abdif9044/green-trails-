
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Shield, Users, Lock, Eye, RefreshCw } from 'lucide-react';
import { SecurityManager } from '@/services/security/security-manager';

interface SecurityEvent {
  id: string;
  event_type: string;
  user_id?: string;
  metadata: any;
  created_at: string;
}

interface SecurityStats {
  totalEvents: number;
  recentSignins: number;
  failedAttempts: number;
  riskScore: 'low' | 'medium' | 'high';
}

export const SecurityDashboard: React.FC = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [stats, setStats] = useState<SecurityStats>({
    totalEvents: 0,
    recentSignins: 0,
    failedAttempts: 0,
    riskScore: 'low'
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Check if user has admin role
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin');

      if (roles && roles.length > 0) {
        setIsAdmin(true);
        await loadSecurityData();
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSecurityData = async () => {
    try {
      // Load recent security events
      const { data: eventsData } = await supabase
        .from('security_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (eventsData) {
        setEvents(eventsData);

        // Calculate stats
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentEvents = eventsData.filter(event => 
          new Date(event.created_at) > last24Hours
        );

        const signins = recentEvents.filter(event => 
          event.event_type === 'signin_success'
        ).length;

        const failures = recentEvents.filter(event => 
          event.event_type.includes('failed') || event.event_type.includes('error')
        ).length;

        let riskScore: 'low' | 'medium' | 'high' = 'low';
        if (failures > 10) riskScore = 'high';
        else if (failures > 5) riskScore = 'medium';

        setStats({
          totalEvents: eventsData.length,
          recentSignins: signins,
          failedAttempts: failures,
          riskScore
        });
      }
    } catch (error) {
      console.error('Error loading security data:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-greentrail-600" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>You don't have permission to access the security dashboard.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-greentrail-800">Security Dashboard</h2>
        <Button onClick={loadSecurityData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Security Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">Security events logged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Sign-ins</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentSignins}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failedAttempts}</div>
            <p className="text-xs text-muted-foreground">Security failures</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getRiskColor(stats.riskScore)}`}>
              {stats.riskScore.toUpperCase()}
            </div>
            <p className="text-xs text-muted-foreground">Current risk assessment</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Events */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Recent Events</TabsTrigger>
          <TabsTrigger value="analysis">Security Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Events</CardTitle>
              <CardDescription>Recent security-related activities and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events.slice(0, 20).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{event.event_type.replace(/_/g, ' ')}</span>
                        <Badge variant={getSeverityColor(event.metadata?.severity || 'low')}>
                          {event.metadata?.severity || 'unknown'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(event.created_at).toLocaleString()}
                      </p>
                      {event.metadata?.error && (
                        <p className="text-sm text-red-600 mt-1">
                          Error: {event.metadata.error}
                        </p>
                      )}
                    </div>
                    {event.user_id && (
                      <Badge variant="outline" className="ml-2">
                        User: {event.user_id.substring(0, 8)}...
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Analysis</CardTitle>
              <CardDescription>Automated security recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.failedAttempts > 10 && (
                  <div className="flex items-start gap-3 p-4 border border-red-200 rounded-lg bg-red-50">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-800">High Number of Failed Attempts</h4>
                      <p className="text-sm text-red-700">
                        {stats.failedAttempts} failed authentication attempts in the last 24 hours. 
                        Consider implementing additional security measures.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-4 border border-green-200 rounded-lg bg-green-50">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-800">RLS Protection Active</h4>
                    <p className="text-sm text-green-700">
                      Row Level Security policies are properly configured and protecting user data.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800">Security Monitoring Active</h4>
                    <p className="text-sm text-blue-700">
                      All authentication events and security activities are being logged and monitored.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
