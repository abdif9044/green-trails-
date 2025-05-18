
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { Trail } from '@/types/trails';
import TrailPathLayer from './TrailPathLayer';

interface MapTrailPathsProps {
  trails: Trail[];
  map: mapboxgl.Map;
  onTrailSelect?: (trailId: string) => void;
}

const MapTrailPaths: React.FC<MapTrailPathsProps> = ({ trails, map, onTrailSelect }) => {
  if (!trails || trails.length === 0) {
    return null;
  }

  return (
    <>
      {trails.map(trail => {
        // Skip trails without path data
        if (!trail.path_data) {
          return null;
        }
        
        return (
          <TrailPathLayer
            key={trail.id}
            trail={trail}
            map={map}
            onClick={() => onTrailSelect?.(trail.id)}
          />
        );
      })}
    </>
  );
};

export default MapTrailPaths;
