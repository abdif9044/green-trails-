
import React from 'react';
import { Loader2 } from 'lucide-react';

interface MapLoadingStateProps {
  message?: string;
}

const MapLoadingState: React.FC<MapLoadingStateProps> = ({ message = 'Loading map...' }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-greentrail-950/80 z-20">
      <div className="flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-greentrail-600" />
        <span className="mt-2 text-greentrail-800 dark:text-greentrail-200">{message}</span>
      </div>
    </div>
  );
};

export default MapLoadingState;
