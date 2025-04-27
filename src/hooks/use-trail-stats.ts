
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Represents trail statistics including visits, ratings, and comments
 */
interface TrailStats {
  visit_count: number;
  completion_count: number;
  avg_rating: number;
  rating_count: number;
  comment_count: number;
}

/**
 * Hook to fetch and manage trail statistics
 * @param trailId - The unique identifier of the trail
 * @returns An object containing trail statistics, loading state, and error information
 */
export const useTrailStats = (trailId: string) => {
  return useQuery({
    queryKey: ['trail-stats', trailId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('execute_sql', {
        sql_query: `
          SELECT 
            COALESCE(COUNT(DISTINCT tl.id), 0) as visit_count,
            0 as completion_count,
            COALESCE(AVG(tr.rating), 0) as avg_rating,
            COALESCE(COUNT(DISTINCT tr.id), 0) as rating_count,
            COALESCE(COUNT(DISTINCT tc.id), 0) as comment_count
          FROM (SELECT $1::text as trail_id) t
          LEFT JOIN trail_likes tl ON tl.trail_id = t.trail_id
          LEFT JOIN trail_ratings tr ON tr.trail_id = t.trail_id
          LEFT JOIN trail_comments tc ON tc.trail_id = t.trail_id
        `,
        params: JSON.stringify([trailId])
      });

      if (error) {
        console.error('Error fetching trail stats:', error);
        throw error;
      }

      const statsData = data?.[0] as Record<string, any> || {};
      
      return {
        visit_count: Math.round(Number(statsData.visit_count || 0)),
        completion_count: Math.round(Number(statsData.completion_count || 0)),
        avg_rating: Number((Number(statsData.avg_rating || 0)).toFixed(1)),
        rating_count: Math.round(Number(statsData.rating_count || 0)),
        comment_count: Math.round(Number(statsData.comment_count || 0))
      } as TrailStats;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 15, // Keep unused data for 15 minutes
  });
};
