
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTrailRatings = (trailId: string) => {
  return useQuery({
    queryKey: ['trail-ratings', trailId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('trail_ratings')
          .select('*')
          .eq('trail_id', trailId);

        if (error) {
          console.error('Error fetching trail ratings:', error);
          return [];
        }

        return data || [];
      } catch (error) {
        console.error('Error fetching trail ratings:', error);
        return [];
      }
    },
    enabled: !!trailId,
  });
};
