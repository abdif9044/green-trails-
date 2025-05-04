
import React from 'react';
import mapboxgl from 'mapbox-gl';
import ParkingMarker, { ParkingSpot } from './ParkingMarker';
import { Trail } from '@/types/trails';

interface MapParkingMarkersProps {
  parkingSpots: ParkingSpot[];
  map: mapboxgl.Map;
  trails?: Trail[];
}

const MapParkingMarkers: React.FC<MapParkingMarkersProps> = ({ parkingSpots, map, trails }) => {
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
