
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface BulkImportProgressCardProps {
  progress: number;
  showDetails?: boolean;
}

const BulkImportProgressCard: React.FC<BulkImportProgressCardProps> = ({ 
  progress,
  showDetails = false
}) => {
  return (
    <Card className="bg-white dark:bg-greentrail-800 border border-greentrail-200 dark:border-greentrail-700 mb-4">
      <CardContent className="pt-4">
        <div className="flex justify-between mb-2 items-center">
          <div className="flex items-center">
            {progress < 100 && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin text-greentrail-600" />
            )}
            <span className="text-sm font-medium">
              {progress < 100 ? 'Bulk Import in Progress' : 'Import Complete'}
            </span>
          </div>
          <span className="text-sm font-medium">
            {progress}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">
          {progress < 100 
            ? "Importing trails in background. You can continue using the application." 
            : "All trails have been imported successfully."
          }
        </p>
        
        {showDetails && progress > 0 && (
          <div className="mt-3 text-xs border-t pt-2 border-greentrail-100 dark:border-greentrail-700">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div>Processing trails...</div>
              <div className="text-right">{Math.round(progress * 50)}+</div>
              
              <div>Estimated time remaining:</div>
              <div className="text-right">
                {progress < 95 
                  ? `${Math.ceil((100 - progress) / 5)} minutes` 
                  : "Less than a minute"
                }
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BulkImportProgressCard;
