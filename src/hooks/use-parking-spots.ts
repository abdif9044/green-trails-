
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ParkingSpot {
  id: string;
  trail_id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  is_free: boolean | null;
  capacity: number | null;
  notes: string | null;
  created_at?: string;
  updated_at?: string;
}

export const useParkingSpots = (trailId?: string) => {
  return useQuery({
    queryKey: ['parking-spots', trailId],
    queryFn: async () => {
      try {
        let query = supabase.from('parking_spots').select('*');
        
        if (trailId) {
          query = query.eq('trail_id', trailId);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching parking spots:', error);
          return [];
        }
        
        // Transform data to match interface
        const transformedData: ParkingSpot[] = (data || []).map(spot => ({
          id: spot.id,
          trail_id: spot.trail_id,
          name: spot.name || 'Parking Area',
          description: spot.description,
          latitude: spot.latitude || spot.lat,
          longitude: spot.longitude || spot.lon,
          is_free: spot.is_free,
          capacity: spot.capacity,
          notes: spot.notes,
          created_at: spot.created_at
        }));
        
        return transformedData;
      } catch (error) {
        console.error('Error in useParkingSpots:', error);
        return [];
      }
    },
    enabled: true,
  });
};
