
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Zap, RotateCcw, CheckCircle } from 'lucide-react';
import { RecoveryStatus } from '../types/import-types';

interface RecoveryActionsProps {
  status: RecoveryStatus;
  onExecuteRecovery: () => void;
  onResetRecovery: () => void;
}

export const RecoveryActions: React.FC<RecoveryActionsProps> = ({
  status,
  onExecuteRecovery,
  onResetRecovery
}) => {
  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'testing':
      case 'scaling': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          Emergency Recovery System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge className={getPhaseColor(status.phase)}>
            {getPhaseIcon(status.phase)}
            {status.phase.charAt(0).toUpperCase() + status.phase.slice(1)}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Phase {status.phase === 'initialization' ? '1' : status.phase === 'testing' ? '2' : status.phase === 'scaling' ? '3' : '4'} of 4
          </span>
        </div>

        <div className="space-y-2">
          <p className="font-medium">{status.step}</p>
          {status.progress > 0 && (
            <>
              <Progress value={status.progress} className="w-full" />
              <p className="text-xs text-muted-foreground">{status.progress}% complete</p>
            </>
          )}
        </div>

        {status.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{status.error}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={onExecuteRecovery}
            disabled={!status.canProceed}
            className="flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            {status.phase === 'completed' ? 'Run Again' : 'Start Recovery'}
          </Button>
          
          {(status.phase === 'error' || status.phase === 'completed') && (
            <Button
              onClick={onResetRecovery}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Phase 1:</strong> Initialize bulletproof import system</p>
          <p><strong>Phase 2:</strong> Test with 1,000 validated trails</p>
          <p><strong>Phase 3:</strong> Scale to 25,000+ trails with parallel processing</p>
          <p><strong>Phase 4:</strong> Validate and monitor system health</p>
        </div>
      </CardContent>
    </Card>
  );
};
