
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface BulkImportProgressCardProps {
  progress: number;
}

const BulkImportProgressCard: React.FC<BulkImportProgressCardProps> = ({ 
  progress 
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Bulk Import in Progress</span>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 gap-1">
              <Clock className="w-3 h-3" />
              Processing
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              This may take some time for large imports
            </span>
            <span className="font-medium">
              {progress}% complete
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkImportProgressCard;
