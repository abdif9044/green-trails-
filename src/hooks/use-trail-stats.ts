
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
      // Use a raw SQL query instead of direct function access
      const { data, error } = await supabase
        .rpc('execute_sql', {
          sql_query: `SELECT * FROM get_trail_stats('${trailId}')`
        });

      if (error) throw error;
      
      // Parse the JSON result from get_trail_stats function
      const stats = data && data[0] ? data[0].get_trail_stats || {} : {
        visit_count: 0,
        completion_count: 0,
        avg_rating: 0,
        rating_count: 0,
        comment_count: 0
      };
      
      return stats as TrailStats;
    },
  });
};
