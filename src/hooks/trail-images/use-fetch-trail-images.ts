
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

      // Process the data to include full image URLs
      return data.map(image => {
        // Get public URL for each image
        try {
          const publicUrl = supabase.storage
            .from('trail_images')
            .getPublicUrl(image.image_path)
            .data.publicUrl;
          
          return {
            ...image,
            full_image_url: publicUrl
          } as TrailImage;
        } catch (e) {
          console.error(`Error getting public URL for image ${image.id}:`, e);
          return image as TrailImage;
        }
      }) as TrailImage[];
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};
