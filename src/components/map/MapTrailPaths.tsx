
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Trail } from '@/types/trails';
import TrailPathLayer from './TrailPathLayer';

interface MapTrailPathsProps {
  trails: Trail[];
  map: mapboxgl.Map;
  onTrailSelect?: (trailId: string) => void;
}

const MapTrailPaths: React.FC<MapTrailPathsProps> = ({ trails, map, onTrailSelect }) => {
  if (!trails || trails.length === 0 || !map) {
    return null;
  }

  return (
    <>
      {trails.map(trail => {
        // Skip trails without geojson data
        if (!trail.geojson?.features) {
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
