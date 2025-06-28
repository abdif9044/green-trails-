
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Database, Loader2 } from 'lucide-react';

const SimpleDebugMonitor: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Import Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-gray-300 animate-spin" />
            <h3 className="text-lg font-semibold mb-2">Import System Rebuilding</h3>
            <p className="text-gray-600 text-sm mb-4">
              Trail import monitoring is being restored with improved reliability and performance.
            </p>
            <Badge variant="outline" className="mb-2">
              <AlertCircle className="h-3 w-3 mr-1" />
              System Maintenance
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleDebugMonitor;
