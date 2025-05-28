
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { Database, MapPin, Zap } from 'lucide-react';
import MassiveImportTrigger from '@/components/trails/MassiveImportTrigger';

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
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trail Data Import System
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Import real trail data from multiple sources to build a comprehensive trail database
          </p>
        </div>

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
                {trailCount >= 1000 ? "Ready for Production" : "Needs More Data"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Massive Import Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Phase 1: Massive Trail Import
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Import 15,000 real trails from multiple sources across North America
            </p>
          </div>

          <MassiveImportTrigger />
        </div>

        {/* Benefits Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              What This Import Provides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Real Trail Data</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Accurate GPS coordinates</li>
                  <li>• Real difficulty ratings</li>
                  <li>• Actual trail lengths & elevation</li>
                  <li>• Current trail conditions</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Geographic Coverage</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• All US national parks</li>
                  <li>• Major Canadian parks</li>
                  <li>• Popular hiking destinations</li>
                  <li>• Local and regional trails</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Next Steps After Import</CardTitle>
            <CardDescription>
              Once the massive import is complete, you'll have access to:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 text-greentrail-600" />
                <div>
                  <div className="font-medium">Enhanced Discover Page</div>
                  <div className="text-sm text-gray-600">
                    Powerful filtering and search across 15,000+ real trails
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 text-greentrail-600" />
                <div>
                  <div className="font-medium">Geographic Search</div>
                  <div className="text-sm text-gray-600">
                    Find trails near any location with PostGIS-powered search
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 text-greentrail-600" />
                <div>
                  <div className="font-medium">Production Ready</div>
                  <div className="text-sm text-gray-600">
                    Ready for real users with a comprehensive trail database
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AutoImport;
