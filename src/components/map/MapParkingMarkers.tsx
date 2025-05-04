
import React from 'react';
import mapboxgl from 'mapbox-gl';
import ParkingMarker from './ParkingMarker';

interface ParkingSpot {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  is_free: boolean | null;
  capacity: number | null;
  notes: string | null;
  trail_id: string;
}

interface MapParkingMarkersProps {
  parkingSpots: ParkingSpot[];
  map: mapboxgl.Map;
}

const MapParkingMarkers: React.FC<MapParkingMarkersProps> = ({ parkingSpots, map }) => {
  return (
    <>
      {parkingSpots.map(parkingSpot => (
        <ParkingMarker
          key={parkingSpot.id}
          parkingSpot={parkingSpot}
          map={map}
        />
      ))}
    </>
  );
};

export default MapParkingMarkers;
