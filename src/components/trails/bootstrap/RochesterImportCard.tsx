
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Zap } from 'lucide-react';

interface RochesterImportCardProps {
  onImport: () => void;
  isImporting: boolean;
  isLoading: boolean;
  autoTriggered: boolean;
}

export function RochesterImportCard({ 
  onImport, 
  isImporting, 
  isLoading, 
  autoTriggered 
}: RochesterImportCardProps) {
  return (
    <>
      {/* Auto Rochester Import Status */}
      {autoTriggered && (
        <Card className="bg-blue-50 border border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600 animate-pulse" />
                <span className="font-medium text-blue-800">🎯 Auto-Importing Rochester Trails</span>
              </div>
              <Badge variant="outline" className="text-blue-600 border-blue-300">
                5,555 Trails
              </Badge>
            </div>
            <p className="text-sm text-blue-600 mb-3">
              Automatically importing location-specific trails for Rochester, Minnesota area within 100-mile radius
            </p>
            <div className="text-xs text-blue-500">
              ✅ Import started automatically • No user action required • Progress will update in real-time
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rochester Import Section */}
      <Card className="bg-blue-50 border border-blue-200">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-800">Rochester, MN Import</span>
            </div>
            <Badge variant="outline" className="text-blue-600 border-blue-300">
              5,555 Trails
            </Badge>
          </div>
          <p className="text-sm text-blue-600 mb-3">
            Import location-specific trails for Rochester, Minnesota area within 100-mile radius
          </p>
          <Button 
            onClick={onImport}
            disabled={isImporting || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <MapPin className="h-4 w-4 mr-2" />
            {isImporting ? 'Importing Rochester Trails...' : 'Import 5,555 Rochester Trails'}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
