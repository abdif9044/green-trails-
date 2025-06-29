
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../use-toast';

export const useDeleteTrailImage = (trailId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (imageId: string) => {
      // Get the trail image record to find the file path
      const { data: image, error: fetchError } = await supabase
        .from('trail_images')
        .select('image_path')
        .eq('id', imageId)
        .single();

      if (fetchError) throw fetchError;

      // Delete the image file from storage
      if (image?.image_path) {
        const { error: storageError } = await supabase.storage
          .from('trail-images')
          .remove([image.image_path]);
        
        if (storageError) {
          console.error('Storage deletion error:', storageError);
          // Continue with database deletion even if storage fails
        }
      }

      // Delete the record from trail_images table
      const { error: deleteError } = await supabase
        .from('trail_images')
        .delete()
        .eq('id', imageId);

      if (deleteError) throw deleteError;

      return imageId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trail-images', trailId] });
      toast({
        title: "Image deleted",
        description: "The trail image has been removed successfully.",
      });
    },
    onError: (error) => {
      console.error('Error deleting trail image:', error);
      toast({
        title: "Error",
        description: "Failed to delete the image. Please try again.",
        variant: "destructive",
      });
    },
  });
};
