
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Database, Zap, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { EmergencyTrailBootstrap } from '../emergency/EmergencyTrailBootstrap';

export const EmergencyDashboard: React.FC = () => {
  const [trailCount, setTrailCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  const checkTrailCount = async () => {
    try {
      const { count, error } = await supabase
        .from('trails')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('Error checking trail count:', error);
        return;
      }
      
      setTrailCount(count || 0);
      setLastCheck(new Date());
    } catch (error) {
      console.error('Error checking trail count:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkTrailCount();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(checkTrailCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = () => {
    if (trailCount === 0) {
      return <Badge variant="destructive" className="ml-2">CRITICAL - NO TRAILS</Badge>;
    } else if (trailCount < 99) {
      return <Badge variant="secondary" className="ml-2">INSUFFICIENT - {trailCount} TRAILS</Badge>;
    } else {
      return <Badge variant="default" className="ml-2 bg-green-600">READY - {trailCount} TRAILS</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            GreenTrails Launch Status
            {getStatusBadge()}
          </CardTitle>
          <CardDescription>
            Launch requires minimum 99 trails. Current status: {isLoading ? 'Checking...' : `${trailCount} trails`}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className={`text-3xl font-bold ${trailCount === 0 ? 'text-red-600' : trailCount < 99 ? 'text-yellow-600' : 'text-green-600'}`}>
                {trailCount.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Trails</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className={`text-3xl font-bold ${trailCount >= 99 ? 'text-green-600' : 'text-red-600'}`}>
                {trailCount >= 99 ? '✓' : '✗'}
              </div>
              <div className="text-sm text-muted-foreground">Launch Ready</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-blue-600">4</div>
              <div className="text-sm text-muted-foreground">Weeks Remaining</div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <Button onClick={checkTrailCount} variant="outline" size="sm">
              Refresh Count
            </Button>
            <span className="text-xs text-muted-foreground">
              Last checked: {lastCheck.toLocaleTimeString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Actions */}
      {trailCount < 99 && (
        <EmergencyTrailBootstrap />
      )}

      {/* Launch Readiness Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Launch Readiness Checklist
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Trail Database (99+ trails)</span>
              {trailCount >= 99 ? (
                <Badge variant="default" className="bg-green-600">✓ Complete</Badge>
              ) : (
                <Badge variant="destructive">✗ Incomplete</Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <span>Weather Prophet Integration</span>
              <Badge variant="secondary">⏳ Pending</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Map Integration</span>
              <Badge variant="default" className="bg-green-600">✓ Complete</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>User Authentication</span>
              <Badge variant="default" className="bg-green-600">✓ Complete</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
