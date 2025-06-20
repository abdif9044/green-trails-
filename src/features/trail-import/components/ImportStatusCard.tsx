
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { ImportProgress } from '../types/import-types';

interface ImportStatusCardProps {
  progress: ImportProgress;
  onRefresh: () => void;
}

export const ImportStatusCard: React.FC<ImportStatusCardProps> = ({ progress, onRefresh }) => {
  const getStatusIcon = () => {
    if (progress.isActive) {
      return <Loader2 className="h-5 w-5 animate-spin text-blue-600" />;
    } else if (progress.currentCount > 0) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    } else {
      return <AlertCircle className="h-5 w-5 text-amber-600" />;
    }
  };

  const getStatusBadge = () => {
    if (progress.isActive) {
      return <Badge variant="secondary">Processing</Badge>;
    } else if (progress.currentCount > 0) {
      return <Badge variant="default">Ready</Badge>;
    } else {
      return <Badge variant="destructive">Empty Database</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Trail Database Status
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div className="flex-1">
            <p className="font-medium">{progress.currentStep}</p>
            <p className="text-sm text-muted-foreground">
              {progress.currentCount.toLocaleString()} trails in database
            </p>
          </div>
        </div>

        {progress.isActive && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Import Progress</span>
              <span>{progress.progress}%</span>
            </div>
            <Progress value={progress.progress} className="w-full" />
            <p className="text-xs text-muted-foreground">
              Target: {progress.targetCount.toLocaleString()} trails
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
