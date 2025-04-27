
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Trail } from '@/types/trails';

export const useSimilarTrails = (trailId: string) => {
  return useQuery({
    queryKey: ['similar-trails', trailId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('find_similar_trails', { 
          p_trail_id: trailId,
          p_limit: 3
        });

      if (error) throw error;
      return data as Trail[];
    },
  });
};
