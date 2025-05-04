
import React from 'react';
import mapboxgl from 'mapbox-gl';
import ParkingMarker from './ParkingMarker';

interface ParkingSpot {
  id: string;
  trail_id: string;
  name: string;
  is_free: boolean;
  latitude: number;
  longitude: number;
  description?: string;
  capacity?: number | null;
  notes?: string | null;
}

interface MapParkingMarkersProps {
  parkingSpots: ParkingSpot[];
  map: mapboxgl.Map;
}

const MapParkingMarkers: React.FC<MapParkingMarkersProps> = ({ parkingSpots, map }) => {
  return (
    <>
      {parkingSpots.map(spot => (
        <ParkingMarker
          key={spot.id}
          parkingSpot={spot}
          map={map}
        />
      ))}
    </>
  );
};

export default MapParkingMarkers;
