
import React from 'react';

export interface DiscoverViewControlsProps {
  viewMode: 'list' | 'map';
  onViewModeChange: (mode: 'list' | 'map') => void;
  showTrailPaths: boolean;
  resultsCount?: number;
}

const DiscoverViewControls: React.FC<DiscoverViewControlsProps> = ({
  viewMode,
  onViewModeChange,
  showTrailPaths,
  resultsCount = 0
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {resultsCount} trails found
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onViewModeChange('list')}
          className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
        >
          List
        </button>
        <button
          onClick={() => onViewModeChange('map')}
          className={`px-3 py-1 rounded ${viewMode === 'map' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
        >
          Map
        </button>
      </div>
    </div>
  );
};

export default DiscoverViewControls;
