
import React from 'react';

interface TrailCardStatsProps {
  length: number;
  elevation: number;
}

export const TrailCardStats = ({ length, elevation }: TrailCardStatsProps) => {
  return (
    <div className="grid grid-cols-2 gap-2 mt-3">
      <div className="text-sm">
        <span className="text-greentrail-600 dark:text-greentrail-400">Length</span>
        <p className="font-medium text-greentrail-800 dark:text-greentrail-200">{length} miles</p>
      </div>
      <div className="text-sm">
        <span className="text-greentrail-600 dark:text-greentrail-400">Elevation</span>
        <p className="font-medium text-greentrail-800 dark:text-greentrail-200">{elevation} ft</p>
      </div>
    </div>
  );
};
