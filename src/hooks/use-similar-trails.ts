
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Trail } from '@/types/trails';

export const useSimilarTrails = (trailId: string) => {
  return useQuery({
    queryKey: ['similar-trails', trailId],
    queryFn: async () => {
      // Use a raw SQL query instead of direct function access
      const { data, error } = await supabase
        .rpc('execute_sql', {
          sql_query: `SELECT * FROM find_similar_trails('${trailId}')`
        });

      if (error) throw error;
      
      // Parse the JSON result from find_similar_trails function
      const trails = data && data[0] ? data[0].find_similar_trails || [] : [];
      return trails as Trail[];
    },
  });
};
