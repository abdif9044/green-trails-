
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TrailImage } from './types';

/**
 * Hook to fetch images for a specific trail
 */
export const useTrailImages = (trailId: string) => {
  return useQuery({
    queryKey: ['trail-images', trailId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trail_images')
        .select('*')
        .eq('trail_id', trailId)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TrailImage[];
    }
  });
};
