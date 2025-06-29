
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface TrailStats {
  visit_count: number;
  completion_count: number;
  avg_rating: number;
  rating_count: number;
  comment_count: number;
}

export const useTrailStats = (trailId: string) => {
  return useQuery({
    queryKey: ['trail-stats', trailId],
    queryFn: async () => {
      try {
        // For now, return mock data since the tables don't exist yet
        // In a real implementation, this would query trail_likes, trail_ratings, trail_comments
        
        const mockStats: TrailStats = {
          visit_count: Math.floor(Math.random() * 500) + 50,
          completion_count: Math.floor(Math.random() * 200) + 20,
          avg_rating: Number((Math.random() * 2 + 3).toFixed(1)), // Between 3.0 and 5.0
          rating_count: Math.floor(Math.random() * 100) + 10,
          comment_count: Math.floor(Math.random() * 50) + 5
        };
        
        return mockStats;
      } catch (error) {
        console.error('Error fetching trail stats:', error);
        return {
          visit_count: 0,
          completion_count: 0,
          avg_rating: 0,
          rating_count: 0,
          comment_count: 0
        } as TrailStats;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 15, // Keep unused data for 15 minutes
  });
};
