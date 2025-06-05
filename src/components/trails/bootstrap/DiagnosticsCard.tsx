
import { Settings } from 'lucide-react';

interface DiagnosticsCardProps {
  diagnostics: { hasPermissions: boolean; errors: string[] } | null;
}

export function DiagnosticsCard({ diagnostics }: DiagnosticsCardProps) {
  if (!diagnostics) return null;

  return (
    <>
      {/* Schema Fix Notice */}
      <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="h-4 w-4 text-blue-600" />
          <span className="font-medium text-blue-800">✅ Schema Fixes Applied</span>
        </div>
        <div className="text-blue-600 text-xs">
          • Fixed trail_length → length mapping<br/>
          • Fixed terrain_type → surface mapping<br/>
          • Added required field validation<br/>
          • Improved error handling & logging
        </div>
      </div>

      {/* Diagnostics Status */}
      <div className={`p-3 rounded-lg text-sm ${
        diagnostics.hasPermissions 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">
            {diagnostics.hasPermissions ? '✅ System Diagnostics: PASSED' : '❌ System Issues Detected'}
          </span>
        </div>
        {!diagnostics.hasPermissions && diagnostics.errors.length > 0 && (
          <div className="text-xs text-red-600 ml-6">
            {diagnostics.errors.slice(0, 2).map((error, i) => (
              <div key={i}>• {error}</div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
