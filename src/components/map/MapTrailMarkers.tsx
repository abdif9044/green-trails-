
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Trail } from '@/types/trails';
import MapMarker from './MapMarker';

interface MapTrailMarkersProps {
  trails: Trail[];
  map: mapboxgl.Map;
  onTrailSelect?: (trailId: string) => void;
}

const MapTrailMarkers: React.FC<MapTrailMarkersProps> = ({ trails, map, onTrailSelect }) => {
  if (!trails || trails.length === 0 || !map) {
    return null;
  }
  
  return (
    <>
      {trails.map(trail => {
        // Skip trails without valid coordinates
        if (!trail.coordinates || !trail.coordinates[0] || !trail.coordinates[1]) {
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
