
import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import ParkingMarker from './ParkingMarker';
import { Trail } from '@/types/trails';
import { supabase } from '@/integrations/supabase/client';

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

interface MapParkingMarkersProps {
  parkingSpots: ParkingSpot[];
  map: mapboxgl.Map;
  trails?: Trail[];
}

const MapParkingMarkers: React.FC<MapParkingMarkersProps> = ({ 
  parkingSpots: providedParkingSpots = [],
  trails = [],
  map 
}) => {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>(providedParkingSpots);
  
  // If parking spots weren't provided or are empty, fetch them based on trail IDs
  useEffect(() => {
    const fetchParkingSpots = async () => {
      if (providedParkingSpots.length > 0 || trails.length === 0) return;
      
      const trailIds = trails.map(trail => trail.id).filter(Boolean);
      if (trailIds.length === 0) return;
      
      try {
        const { data, error } = await supabase
          .from('parking_spots')
          .select('*')
          .in('trail_id', trailIds);
          
        if (error) {
          console.error('Error fetching parking spots:', error);
          return;
        }
        
        if (data && data.length > 0) {
          // Transform the data to match the expected interface
          const transformedSpots: ParkingSpot[] = data.map(spot => ({
            id: spot.id,
            name: spot.name || 'Parking Area',
            description: spot.description || null,
            latitude: spot.latitude || spot.lat,
            longitude: spot.longitude || spot.lon,
            is_free: spot.is_free,
            capacity: spot.capacity,
            notes: spot.notes,
            trail_id: spot.trail_id
          }));
          
          setParkingSpots(transformedSpots);
        }
      } catch (err) {
        console.error('Failed to fetch parking spots:', err);
      }
    };
    
    fetchParkingSpots();
  }, [trails, providedParkingSpots]);

  if (!map || parkingSpots.length === 0) {
    return null;
  }

  return (
    <>
      {parkingSpots.map(parkingSpot => {
        if (!parkingSpot.latitude || !parkingSpot.longitude) {
          return null;
        }
        
        return (
          <ParkingMarker
            key={parkingSpot.id}
            parkingSpot={parkingSpot}
            map={map}
          />
        );
      })}
    </>
  );
};

export default MapParkingMarkers;
