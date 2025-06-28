
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { Trail } from '@/types/trails';

// Simplified parking markers component until database types are updated
export interface ParkingSpot {
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

interface SimpleParkingMarkersProps {
  parkingSpots?: ParkingSpot[];
  map: mapboxgl.Map;
  trails?: Trail[];
}

const SimpleParkingMarkers: React.FC<SimpleParkingMarkersProps> = ({ 
  parkingSpots = [],
  trails = [],
  map 
}) => {
  // For now, just return null until database types are updated
  // This prevents build errors while maintaining the component structure
  console.log('Parking spots will be available after database types are updated', { parkingSpots, trails, map });
  
  return null;
};

export default SimpleParkingMarkers;
