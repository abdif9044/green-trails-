
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useMassiveTrailImport } from '@/hooks/use-massive-trail-import';
import { Download, MapPin, Globe, Timer, CheckCircle, AlertCircle } from 'lucide-react';

const MassiveImportTrigger: React.FC = () => {
  const { isImporting, progress, quickStart15KTrails } = useMassiveTrailImport();

  const handleStartImport = async () => {
    const success = await quickStart15KTrails();
    if (!success) {
      console.error('Failed to start massive import');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-greentrail-600" />
          Massive Trail Import System
        </CardTitle>
        <CardDescription>
          Import 15,000 real trails from multiple sources across North America
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Import Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-greentrail-600">15,000</div>
            <div className="text-sm text-gray-600">Target Trails</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">8</div>
            <div className="text-sm text-gray-600">Data Sources</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">3</div>
            <div className="text-sm text-gray-600">Countries</div>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Geographic Distribution
          </h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">🇺🇸 USA: 8,000 trails</Badge>
            <Badge variant="outline">🇨🇦 Canada: 4,000 trails</Badge>
            <Badge variant="outline">🇲🇽 Mexico: 3,000 trails</Badge>
          </div>
        </div>

        {/* Data Sources */}
        <div className="space-y-2">
          <h4 className="font-semibold">Data Sources</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>• Hiking Project API</div>
            <div>• OpenStreetMap</div>
            <div>• USGS National Map</div>
            <div>• Parks Canada</div>
            <div>• INEGI Mexico</div>
            <div>• Trails BC</div>
          </div>
        </div>

        {/* Progress Section */}
        {(isImporting || progress.isRunning) && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Import Progress
              </h4>
              <Badge variant={progress.progressPercent === 100 ? "default" : "secondary"}>
                {progress.progressPercent}% Complete
              </Badge>
            </div>
            
            <Progress value={progress.progressPercent} className="w-full" />
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium">Jobs Completed</div>
                <div>{progress.completedJobs} / {progress.totalJobs}</div>
              </div>
              <div>
                <div className="font-medium">Trails Added</div>
                <div className="text-greentrail-600 font-semibold">
                  {progress.totalTrailsAdded.toLocaleString()}
                </div>
              </div>
            </div>
            
            {progress.estimatedTimeRemaining && (
              <div className="text-sm text-gray-600">
                Estimated time remaining: {progress.estimatedTimeRemaining}
              </div>
            )}
            
            {progress.totalTrailsFailed > 0 && (
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{progress.totalTrailsFailed} trails failed to import</span>
              </div>
            )}
          </div>
        )}

        {/* Success Message */}
        {progress.progressPercent === 100 && !isImporting && (
          <div className="flex items-center gap-2 p-4 bg-green-50 text-green-800 rounded-lg">
            <CheckCircle className="h-5 w-5" />
            <div>
              <div className="font-semibold">Import Complete!</div>
              <div className="text-sm">
                Successfully imported {progress.totalTrailsAdded.toLocaleString()} trails
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={handleStartImport}
          disabled={isImporting || progress.isRunning}
          className="w-full"
          size="lg"
        >
          <Download className="h-5 w-5 mr-2" />
          {isImporting || progress.isRunning 
            ? `Importing... (${progress.progressPercent}%)` 
            : 'Start Massive Import (15,000 Trails)'
          }
        </Button>
        
        <div className="text-xs text-gray-500 text-center">
          This process takes 15-30 minutes and imports real trail data from multiple APIs
        </div>
      </CardContent>
    </Card>
  );
};

export default MassiveImportTrigger;
