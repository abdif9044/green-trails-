
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { Trail } from '@/types/trails';
import MapMarker from './MapMarker';

interface MapTrailMarkersProps {
  trails: Trail[];
  map: mapboxgl.Map;
  onTrailSelect?: (trailId: string) => void;
}

const MapTrailMarkers: React.FC<MapTrailMarkersProps> = ({ trails, map, onTrailSelect }) => {
  if (!trails || trails.length === 0) {
    return null;
  }

  return (
    <>
      {trails.map(trail => {
        // Skip trails without valid coordinates
        if (!trail.latitude || !trail.longitude) {
          return null;
        }
        
        return (
          <MapMarker
            key={trail.id}
            trail={trail}
            map={map}
            onSelect={onTrailSelect}
          />
        );
      })}
    </>
  );
};

export default MapTrailMarkers;
