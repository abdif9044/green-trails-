
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { Database, CheckCircle, Settings } from 'lucide-react';
import AutoBootstrapStatus from '@/components/trails/AutoBootstrapStatus';

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Automated Trail Database System
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Trail data is automatically managed and maintained for all users
          </p>
        </div>

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
                <div className="text-2xl font-bold text-greentrail-600">
                  {isLoading ? 'Loading...' : trailCount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Trails in database</div>
              </div>
              <Badge variant={trailCount >= 1000 ? "default" : "secondary"}>
                {trailCount >= 1000 ? "Fully Populated" : "Auto-Populating"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* System Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              How It Works
            </CardTitle>
            <CardDescription>
              The trail database is fully automated and requires no user intervention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 mt-0.5 text-greentrail-600" />
                <div>
                  <div className="font-medium">Automatic Population</div>
                  <div className="text-sm text-gray-600">
                    When the database has fewer than 1,000 trails, the system automatically imports 15,000 real trails from multiple sources
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 mt-0.5 text-greentrail-600" />
                <div>
                  <div className="font-medium">Background Processing</div>
                  <div className="text-sm text-gray-600">
                    Imports run in the background without affecting user experience. Users can browse trails immediately while more data loads
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 mt-0.5 text-greentrail-600" />
                <div>
                  <div className="font-medium">Daily Health Checks</div>
                  <div className="text-sm text-gray-600">
                    The system monitors trail count daily and automatically maintains database population
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 mt-0.5 text-greentrail-600" />
                <div>
                  <div className="font-medium">Multiple Data Sources</div>
                  <div className="text-sm text-gray-600">
                    Imports from Hiking Project, OpenStreetMap, USGS, Parks Canada, INEGI Mexico, and Trails BC for comprehensive coverage
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Geographic Coverage */}
        <Card>
          <CardHeader>
            <CardTitle>Geographic Coverage</CardTitle>
            <CardDescription>
              Automatic trail distribution across North America
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">8,000</div>
                <div className="text-sm text-gray-600">🇺🇸 United States</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">4,000</div>
                <div className="text-sm text-gray-600">🇨🇦 Canada</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">3,000</div>
                <div className="text-sm text-gray-600">🇲🇽 Mexico</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AutoImport;
