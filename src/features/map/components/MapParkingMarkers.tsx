
import React from 'react';
import mapboxgl from 'mapbox-gl';
import ParkingMarker, { ParkingSpot } from './ParkingMarker';

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
