
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
  return (
    <>
      {trails.map(trail => (
        <MapMarker
          key={trail.id}
          trail={trail}
          map={map}
          onSelect={onTrailSelect}
        />
      ))}
    </>
  );
};

export default MapTrailMarkers;
