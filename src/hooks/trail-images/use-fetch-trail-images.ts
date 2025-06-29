
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TrailImage } from './types';

export const useTrailImages = (trailId: string) => {
  return useQuery({
    queryKey: ['trail-images', trailId],
    queryFn: async (): Promise<TrailImage[]> => {
      if (!trailId) return [];

      try {
        const { data: images, error } = await supabase
          .from('trail_images')
          .select(`
            id,
            image_path,
            caption,
            is_primary,
            user_id,
            created_at,
            updated_at
          `)
          .eq('trail_id', trailId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching trail images:', error);
          throw error;
        }

        if (!images) return [];

        // Transform the data to include full image URLs
        const transformedImages: TrailImage[] = images.map((image) => {
          let fullImageUrl = '';
          
          try {
            if (image.image_path) {
              fullImageUrl = supabase.storage
                .from('trail-images')
                .getPublicUrl(image.image_path).data.publicUrl;
            }
          } catch (e) {
            console.error('Error generating image URL:', e);
          }

          return {
            id: image.id,
            trail_id: trailId,
            image_path: image.image_path,
            full_image_url: fullImageUrl,
            caption: image.caption || '',
            is_primary: image.is_primary || false,
            user_id: image.user_id,
            created_at: image.created_at,
            updated_at: image.updated_at,
          };
        });

        return transformedImages;
      } catch (error) {
        console.error('Error in useTrailImages:', error);
        throw error;
      }
    },
    enabled: !!trailId,
  });
};
