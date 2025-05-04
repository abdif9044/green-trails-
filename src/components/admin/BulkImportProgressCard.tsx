
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface BulkImportProgressCardProps {
  progress: number;
}

const BulkImportProgressCard: React.FC<BulkImportProgressCardProps> = ({ progress }) => {
  return (
    <Card className="bg-white dark:bg-greentrail-800 border border-greentrail-200 dark:border-greentrail-700 mb-4">
      <CardContent className="pt-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">
            Bulk Import in Progress
          </span>
          <span className="text-sm font-medium">
            {progress}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">
          Importing trails in background. You can continue using the application.
        </p>
      </CardContent>
    </Card>
  );
};

export default BulkImportProgressCard;
