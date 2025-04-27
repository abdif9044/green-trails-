
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
      // Use execute_sql to get trail stats
      const { data, error } = await supabase.rpc('execute_sql', {
        sql_query: `
          SELECT 
            (SELECT COUNT(*) FROM trail_likes WHERE trail_id = $1) as visit_count,
            COALESCE((SELECT COUNT(*) FROM trail_comments WHERE trail_id = $1), 0) as comment_count,
            COALESCE((SELECT AVG(rating) FROM trail_ratings WHERE trail_id = $1), 0) as avg_rating,
            COALESCE((SELECT COUNT(*) FROM trail_ratings WHERE trail_id = $1), 0) as rating_count,
            0 as completion_count
        `,
        params: [trailId]
      });

      if (error) throw error;
      
      // Extract the first row from the result set
      const statsData = data && data[0] ? data[0] : null;
      
      // Create default stats if no data was returned
      const stats: TrailStats = {
        visit_count: parseInt(statsData?.visit_count || '0'),
        completion_count: parseInt(statsData?.completion_count || '0'),
        avg_rating: parseFloat(statsData?.avg_rating || '0'),
        rating_count: parseInt(statsData?.rating_count || '0'),
        comment_count: parseInt(statsData?.comment_count || '0')
      };
      
      return stats;
    },
  });
};
