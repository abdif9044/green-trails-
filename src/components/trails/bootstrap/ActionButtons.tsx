
import { Button } from '@/components/ui/button';
import { Zap, RefreshCw } from 'lucide-react';

interface ActionButtonsProps {
  onFixedBootstrap: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  autoTriggered: boolean;
  bootstrapStatus: 'checking' | 'needed' | 'active' | 'complete';
}

export function ActionButtons({ 
  onFixedBootstrap, 
  onRefresh, 
  isLoading, 
  autoTriggered, 
  bootstrapStatus 
}: ActionButtonsProps) {
  return (
    <div className="flex gap-3">
      <Button 
        onClick={onFixedBootstrap}
        disabled={isLoading || autoTriggered}
        className="flex items-center gap-2"
        variant={bootstrapStatus === 'needed' ? 'default' : 'outline'}
      >
        <Zap className="h-4 w-4" />
        {autoTriggered ? 'Auto-Starting...' : isLoading ? 'Starting...' : 'Force Fixed Schema Import'}
      </Button>

      <Button 
        variant="outline" 
        onClick={onRefresh}
        disabled={isLoading}
        size="sm"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );
}
