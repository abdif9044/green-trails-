
import React from 'react';
import { Trail } from '@/types/trails';

export interface TrailSidebarProps {
  trailId: string;
  trail?: Trail;
}

const TrailSidebar: React.FC<TrailSidebarProps> = ({ trailId, trail }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Trail Information</h3>
      {trail && (
        <div className="space-y-3">
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Length:</span>
            <span className="ml-2 font-medium">{trail.length} miles</span>
          </div>
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Difficulty:</span>
            <span className="ml-2 font-medium capitalize">{trail.difficulty}</span>
          </div>
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Elevation:</span>
            <span className="ml-2 font-medium">{trail.elevation} ft</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrailSidebar;
