
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Database, CheckCircle, Settings, Bug } from 'lucide-react';
import AutoBootstrapStatus from '@/components/trails/AutoBootstrapStatus';
import DebugImportMonitor from '@/components/trails/DebugImportMonitor';

const AutoImport: React.FC = () => {
  const [trailCount, setTrailCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrailCount = async () => {
      try {
        const { count, error } = await supabase
          .from('trails')
          .select('*', { count: 'exact', head: true });
        
        if (!error && count !== null) {
          setTrailCount(count);
        }
      } catch (error) {
        console.error('Error fetching trail count:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrailCount();
    
    // Refresh count every 30 seconds
    const interval = setInterval(fetchTrailCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const getSystemStatus = () => {
    if (trailCount >= 25000) return { status: 'Fully Operational', variant: 'default' as const };
    if (trailCount >= 15000) return { status: 'Scaling to 30K', variant: 'secondary' as const };
    if (trailCount >= 5000) return { status: 'Building Database', variant: 'secondary' as const };
    return { status: 'Initializing', variant: 'secondary' as const };
  };

  const systemStatus = getSystemStatus();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            30K Trail Database System
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Comprehensive trail coverage across North America - fully automated
          </p>
        </div>

        <Tabs defaultValue="status" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="status">System Status</TabsTrigger>
            <TabsTrigger value="debug">Debug Monitor</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="space-y-6">
            {/* Auto Bootstrap Status */}
            <AutoBootstrapStatus />

            {/* Current Database Status */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Current Database Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-greentrail-600">
                      {isLoading ? 'Loading...' : trailCount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Trails in database</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Target: 30,000 trails
                    </div>
                  </div>
                  <Badge variant={systemStatus.variant}>
                    {systemStatus.status}
                  </Badge>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-greentrail-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((trailCount / 30000) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {Math.round((trailCount / 30000) * 100)}% complete
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Geographic Coverage */}
            <Card>
              <CardHeader>
                <CardTitle>30K Geographic Distribution</CardTitle>
                <CardDescription>
                  Comprehensive trail coverage across North America
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">15,000</div>
                    <div className="text-sm text-gray-600">🇺🇸 United States</div>
                    <div className="text-xs text-gray-500">Premium hiking trails</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">8,000</div>
                    <div className="text-sm text-gray-600">🇨🇦 Canada</div>
                    <div className="text-xs text-gray-500">Parks & wilderness</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">4,000</div>
                    <div className="text-sm text-gray-600">🇲🇽 Mexico</div>
                    <div className="text-xs text-gray-500">Natural areas & trails</div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">3,000</div>
                    <div className="text-sm text-gray-600">🌍 Global</div>
                    <div className="text-xs text-gray-500">International trails</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="debug">
            <DebugImportMonitor />
          </TabsContent>

          <TabsContent value="architecture" className="space-y-6">
            {/* System Information */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  30K System Architecture
                </CardTitle>
                <CardDescription>
                  Fully automated trail database with comprehensive North American coverage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 mt-0.5 text-greentrail-600" />
                    <div>
                      <div className="font-medium">Automatic 30K Population</div>
                      <div className="text-sm text-gray-600">
                        System automatically imports 30,000 real trails when database has fewer than 5,000 trails
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 mt-0.5 text-greentrail-600" />
                    <div>
                      <div className="font-medium">Enhanced Debug System</div>
                      <div className="text-sm text-gray-600">
                        Real-time monitoring with detailed error tracking and batch processing diagnostics
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 mt-0.5 text-greentrail-600" />
                    <div>
                      <div className="font-medium">High-Performance Import</div>
                      <div className="text-sm text-gray-600">
                        Enhanced import system with 500-trail batches and controlled concurrency for stability
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 mt-0.5 text-greentrail-600" />
                    <div>
                      <div className="font-medium">Three Primary Data Sources</div>
                      <div className="text-sm text-gray-600">
                        Hiking Project API, OpenStreetMap, and USGS with 10,000 trails each for 30K total
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 mt-0.5 text-greentrail-600" />
                    <div>
                      <div className="font-medium">Comprehensive Error Handling</div>
                      <div className="text-sm text-gray-600">
                        Individual trail validation, batch retry mechanisms, and detailed error logging
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AutoImport;
