
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../use-toast';

export const useDeleteTrailImage = (trailId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (imageId: string) => {
      // Since trail_images table doesn't exist, we'll work with album_media instead
      const { data: image, error: fetchError } = await supabase
        .from('album_media')
        .select('file_path')
        .eq('id', imageId)
        .single();

      if (fetchError) throw fetchError;

      // Delete the image file from storage
      if (image?.file_path) {
        const { error: storageError } = await supabase.storage
          .from('trail-images')
          .remove([image.file_path]);
        
        if (storageError) throw storageError;
      }

      // Delete the record
      const { error: deleteError } = await supabase
        .from('album_media')
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
