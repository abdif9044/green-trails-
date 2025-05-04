
import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import ParkingMarker from './ParkingMarker';
import { Trail } from '@/types/trails';
import { supabase } from '@/integrations/supabase/client';

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
  parkingSpots?: ParkingSpot[];
  trails?: Trail[];
  map: mapboxgl.Map;
}

const MapParkingMarkers: React.FC<MapParkingMarkersProps> = ({ 
  parkingSpots: providedParkingSpots,
  trails = [],
  map 
}) => {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>(providedParkingSpots || []);
  
  // If parking spots weren't provided, fetch them based on trail IDs
  useEffect(() => {
    const fetchParkingSpots = async () => {
      if (providedParkingSpots || trails.length === 0) return;
      
      const trailIds = trails.map(trail => trail.id);
      
      const { data, error } = await supabase
        .from('parking_spots')
        .select('*')
        .in('trail_id', trailIds);
        
      if (!error && data) {
        setParkingSpots(data);
      }
    };
    
    fetchParkingSpots();
  }, [trails, providedParkingSpots]);

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
