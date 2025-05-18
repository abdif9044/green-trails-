
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TrailImage } from './types';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to fetch images for a specific trail with better error handling
 */
export const useTrailImages = (trailId: string) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['trail-images', trailId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('trail_images')
          .select('*')
          .eq('trail_id', trailId)
          .order('is_primary', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching trail images:', error);
          throw error;
        }

        if (!data || data.length === 0) {
          console.log(`No images found for trail: ${trailId}`);
          return [];
        }

        // Process the data to include full image URLs
        const processedImages = data.map(image => {
          try {
            if (!image.image_path) {
              console.warn(`Missing image_path for image ${image.id}`);
              return {
                ...image,
                full_image_url: null
              } as TrailImage;
            }

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
            return {
              ...image,
              full_image_url: null
            } as TrailImage;
          }
        }) as TrailImage[];

        return processedImages;
      } catch (error) {
        console.error('Failed to fetch trail images:', error);
        toast({
          title: "Image loading error",
          description: "Failed to load trail images. Please try again later.",
          variant: "destructive",
        });
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
};
