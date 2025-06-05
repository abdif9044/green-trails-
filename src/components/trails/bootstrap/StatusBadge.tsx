
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Zap, AlertCircle, CheckCircle } from 'lucide-react';

interface StatusBadgeProps {
  bootstrapStatus: 'checking' | 'needed' | 'active' | 'complete';
  autoTriggered: boolean;
}

export function StatusBadge({ bootstrapStatus, autoTriggered }: StatusBadgeProps) {
  const getStatusInfo = () => {
    switch (bootstrapStatus) {
      case 'checking':
        return {
          title: 'Checking System',
          description: 'Running diagnostics...',
          variant: 'secondary' as const,
          icon: <RefreshCw className="h-4 w-4 animate-spin" />
        };
      case 'needed':
        return {
          title: autoTriggered ? 'Auto-Starting Import' : 'Import Required',
          description: autoTriggered ? 'Import will begin shortly...' : 'Need 30K trails with fixed schema',
          variant: 'destructive' as const,
          icon: autoTriggered ? <Zap className="h-4 w-4 animate-pulse" /> : <AlertCircle className="h-4 w-4" />
        };
      case 'active':
        return {
          title: 'Downloading Trails',
          description: 'Fixed schema import in progress...',
          variant: 'default' as const,
          icon: <Zap className="h-4 w-4 animate-pulse" />
        };
      case 'complete':
        return {
          title: 'Import Complete',
          description: '30K+ trails loaded',
          variant: 'default' as const,
          icon: <CheckCircle className="h-4 w-4" />
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="flex items-center justify-between">
      <Badge variant={statusInfo.variant} className="flex items-center gap-2">
        {statusInfo.icon}
        {statusInfo.title}
      </Badge>
      <span className="text-sm text-gray-600">{statusInfo.description}</span>
    </div>
  );
}
