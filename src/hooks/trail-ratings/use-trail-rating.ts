
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTrailRating = (trailId: string) => {
  return useQuery({
    queryKey: ['trail-rating', trailId],
    queryFn: async () => {
      try {
        // Get average rating and total count
        const { data, error } = await supabase
          .from('trail_ratings')
          .select('rating')
          .eq('trail_id', trailId);

        if (error) {
          console.error('Error fetching trail rating:', error);
          return {
            average_rating: 0,
            total_ratings: 0,
          };
        }

        if (!data || data.length === 0) {
          return {
            average_rating: 0,
            total_ratings: 0,
          };
        }

        const total = data.length;
        const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
        const average = sum / total;

        return {
          average_rating: average,
          total_ratings: total,
        };
      } catch (error) {
        console.error('Error fetching trail rating:', error);
        return {
          average_rating: 0,
          total_ratings: 0,
        };
      }
    },
    enabled: !!trailId,
  });
};
