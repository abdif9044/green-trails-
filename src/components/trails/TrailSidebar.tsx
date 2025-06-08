
import React from 'react';
import { Trail } from '@/types/trails';
import WeatherInfo from './WeatherInfo';
import TrailConditionReporter from '@/components/map/TrailConditionReporter';
import OfflineMapCache from '@/components/map/OfflineMapCache';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TrailSidebarProps {
  trail: Trail;
}

const TrailSidebar: React.FC<TrailSidebarProps> = ({ trail }) => {
  const bounds = trail.coordinates ? {
    north: trail.coordinates[0] + 0.01,
    south: trail.coordinates[0] - 0.01,
    east: trail.coordinates[1] + 0.01,
    west: trail.coordinates[1] - 0.01
  } : undefined;

  return (
    <div className="space-y-6">
      <WeatherInfo coordinates={trail.coordinates} />
      
      <TrailConditionReporter 
        trailId={trail.id}
        conditions={[
          {
            id: '1',
            type: 'good',
            description: 'Trail is in excellent condition, well maintained',
            reportedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            reportedBy: 'TrailRunner42'
          },
          {
            id: '2',
            type: 'caution',
            description: 'Some muddy sections after recent rain',
            reportedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            reportedBy: 'HikingExplorer'
          }
        ]}
      />
      
      <OfflineMapCache bounds={bounds} />
    </div>
  );
};

export default TrailSidebar;
