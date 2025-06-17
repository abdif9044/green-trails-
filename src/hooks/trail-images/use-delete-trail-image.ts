
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to delete a trail image
 */
export const useDeleteTrailImage = (trailId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (imageId: string) => {
      // Get image URL and check if it's primary
      const { data: imageData } = await supabase
        .from('trail_images')
        .select('url, is_primary')
        .eq('id', imageId)
        .single();

      if (imageData?.url) {
        // Extract path from URL for storage deletion
        const urlPath = imageData.url.split('/').pop();
        if (urlPath) {
          const { error: storageError } = await supabase.storage
            .from('trail_images')
            .remove([`${trailId}/${urlPath}`]);

          if (storageError) console.warn('Storage deletion error:', storageError);
        }
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('trail_images')
        .delete()
        .eq('id', imageId);

      if (dbError) throw dbError;
      
      // If this was primary, try to set another image as primary
      if (imageData?.is_primary) {
        const { data: otherImages, error: fetchError } = await supabase
          .from('trail_images')
          .select('id')
          .eq('trail_id', trailId)
          .neq('id', imageId)
          .limit(1);
          
        if (!fetchError && otherImages && otherImages.length > 0) {
          await supabase
            .from('trail_images')
            .update({ is_primary: true })
            .eq('id', otherImages[0].id);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trail-images', trailId] });
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
