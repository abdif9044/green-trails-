
import { Progress } from '@/components/ui/progress';

interface ProgressSectionProps {
  progress: {
    currentCount: number;
    targetCount: number;
    progressPercent: number;
  };
  bootstrapStatus: 'checking' | 'needed' | 'active' | 'complete';
}

export function ProgressSection({ progress, bootstrapStatus }: ProgressSectionProps) {
  if (bootstrapStatus === 'checking') return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span>Current Trails: {progress.currentCount.toLocaleString()}</span>
        <span>Target: {progress.targetCount.toLocaleString()}</span>
      </div>
      <Progress 
        value={progress.progressPercent} 
        className="w-full"
      />
      <div className="text-xs text-gray-500 text-right">
        {progress.progressPercent}% complete
      </div>
    </div>
  );
}
