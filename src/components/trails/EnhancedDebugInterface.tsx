import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { EnhancedDebugService } from '@/services/trail-import/enhanced-debug-service';

interface EnhancedDebugInterfaceProps {
  onRefresh?: () => void;
}

const EnhancedDebugInterface: React.FC<EnhancedDebugInterfaceProps> = ({ onRefresh }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [debugData, setDebugData] = useState<any>(null);
  
  const runDiagnostics = async () => {
    setIsLoading(true);
    try {
      const [permissions, stats, importTest] = await Promise.all([
        EnhancedDebugService.testDatabasePermissions(),
        EnhancedDebugService.getDatabaseStats(),
        EnhancedDebugService.testImportFunctionality()
      ]);
      
      setDebugData({ permissions, stats, importTest });
    } catch (error) {
      console.error('Debug diagnostics failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Enhanced Trail Debug Interface
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={runDiagnostics} disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Run Diagnostics
          </Button>
          {onRefresh && (
            <Button variant="outline" onClick={onRefresh}>
              Refresh Data
            </Button>
          )}
        </div>
        
        {debugData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Database Permissions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Database Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Can Select</span>
                    {debugData.permissions.canSelect ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Can Insert</span>
                    {debugData.permissions.canInsert ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Database Stats */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Database Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs">Trails</span>
                    <Badge variant="secondary">{debugData.stats.totalTrails}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Users</span>
                    <Badge variant="secondary">{debugData.stats.totalUsers}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Import Status */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Import System</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Edge Functions</span>
                    {debugData.importTest.edgeFunctionAvailable ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Bulk Tables</span>
                    {debugData.importTest.bulkImportTablesExist ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>  
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedDebugInterface;
