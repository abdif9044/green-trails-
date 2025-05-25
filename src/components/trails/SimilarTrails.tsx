
import React from 'react';

export interface SimilarTrailsProps {
  currentTrailId: string;
}

const SimilarTrails: React.FC<SimilarTrailsProps> = ({ currentTrailId }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Similar Trails</h3>
      <div className="space-y-3">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Loading similar trails...
        </div>
      </div>
    </div>
  );
};

export default SimilarTrails;
