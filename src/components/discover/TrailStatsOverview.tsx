
import React from 'react';

interface TrailStatsOverviewProps {
  count: number;
}

export const TrailStatsOverview: React.FC<TrailStatsOverviewProps> = ({ count }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Trail Statistics</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Total Trails:</span>
          <span className="font-medium">{count}</span>
        </div>
      </div>
    </div>
  );
};
