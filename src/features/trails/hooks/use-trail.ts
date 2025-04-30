
import { useQuery } from '@tanstack/react-query';
import { Trail } from '@/types/trails';
import { supabase } from '@/integrations/supabase/client';
import { formatTrailData } from './use-trail-query-base';

export const useTrail = (trailId: string | undefined) => {
  return useQuery({
    queryKey: ['trail', trailId],
    queryFn: async () => {
      if (!trailId) return null;
      
      try {
        const { data, error } = await supabase
          .from('trails')
          .select(`
            *,
            trail_tags (
              id,
              tag,
              is_strain_tag
            )
          `)
          .eq('id', trailId)
          .single();

        if (error) {
          console.error('Error fetching trail:', error);
          throw error;
        }

        if (!data) {
          return null;
        }

        // Format trail data
        const trail: Trail = formatTrailData(data);

        return trail;
      } catch (error) {
        console.error('Error in useTrail:', error);
        return null;
      }
    },
    enabled: !!trailId,
  });
};
