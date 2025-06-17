
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type ParkingSpot = Database['public']['Tables']['parking_spots']['Row'];

export const useParkingSpots = (trailId?: string) => {
  return useQuery({
    queryKey: trailId ? ['parking-spots', trailId] : ['parking-spots'],
    queryFn: async () => {
      let query = supabase.from('parking_spots').select('*');
      
      if (trailId) {
        query = query.eq('trail_id', trailId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as ParkingSpot[];
    },
  });
};
