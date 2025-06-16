
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type ParkingSpot = Database['public']['Tables']['parking_spots']['Row'];

export const useParkingSpots = () => {
  return useQuery({
    queryKey: ['parking-spots'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('parking_spots')
        .select('*');
      
      if (error) throw error;
      return data as ParkingSpot[];
    },
  });
};
