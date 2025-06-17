
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface TrailStats {
  likes: number;
  visits: number;
  avgRating: number;
  totalRatings: number;
}

export const useTrailStats = (trailId: string) => {
  return useQuery({
    queryKey: ['trail-stats', trailId],
    queryFn: async (): Promise<TrailStats> => {
      try {
        // Since trail_likes table doesn't exist, return mock stats
        console.warn('Trail stats tables do not exist, returning mock data');
        
        return {
          likes: 0,
          visits: 0,
          avgRating: 0,
          totalRatings: 0,
        };
      } catch (error) {
        console.error('Error fetching trail stats:', error);
        return {
          likes: 0,
          visits: 0,
          avgRating: 0,
          totalRatings: 0,
        };
      }
    },
    enabled: !!trailId,
  });
};
