
import React from 'react';

const MapLoadingState: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-white/70 dark:bg-gray-800/70 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <div className="h-8 w-8 border-4 border-t-greentrail-600 border-gray-200 rounded-full animate-spin mb-2"></div>
        <p className="text-sm font-medium text-greentrail-800 dark:text-greentrail-200">Loading map...</p>
      </div>
    </div>
  );
};

export default MapLoadingState;
