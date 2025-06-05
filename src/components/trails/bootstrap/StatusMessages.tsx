
import { Zap } from 'lucide-react';

interface StatusMessagesProps {
  bootstrapStatus: 'checking' | 'needed' | 'active' | 'complete';
  autoTriggered: boolean;
  progress: {
    currentCount: number;
    targetCount: number;
    progressPercent: number;
  };
}

export function StatusMessages({ bootstrapStatus, autoTriggered, progress }: StatusMessagesProps) {
  return (
    <>
      {/* Auto-trigger notice */}
      {autoTriggered && bootstrapStatus !== 'active' && (
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-blue-600 animate-pulse" />
            <span className="font-medium text-blue-800">🚀 Auto-Import Initiated</span>
          </div>
          <div className="text-blue-600 text-xs">
            Import process will begin automatically in a few seconds...
          </div>
        </div>
      )}

      {/* Status Details */}
      {bootstrapStatus === 'active' && (
        <div className="bg-blue-50 p-3 rounded-lg text-sm">
          <p className="font-medium text-blue-800">🔧 Fixed Schema Import Active</p>
          <p className="text-blue-600">
            Downloading trails with corrected database schema. All field mappings fixed.
            Process may take 5-15 minutes for full dataset.
          </p>
        </div>
      )}

      {bootstrapStatus === 'complete' && (
        <div className="bg-green-50 p-3 rounded-lg text-sm">
          <p className="font-medium text-green-800">✅ Import Complete</p>
          <p className="text-green-600">
            GreenTrails now has {progress.currentCount.toLocaleString()}+ trails loaded and ready!
          </p>
        </div>
      )}

      {bootstrapStatus === 'needed' && !autoTriggered && (
        <div className="bg-yellow-50 p-3 rounded-lg text-sm">
          <p className="font-medium text-yellow-800">⚠️ Trails Needed</p>
          <p className="text-yellow-600">
            Only {progress.currentCount} trails found. Click "Force Fixed Schema Import" to get 30,000+ trails.
          </p>
        </div>
      )}
    </>
  );
}
