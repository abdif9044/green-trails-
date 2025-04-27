
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
      const { data, error } = await supabase
        .rpc('get_trail_stats', { p_trail_id: trailId });

      if (error) throw error;
      return data as TrailStats;
    },
  });
};
