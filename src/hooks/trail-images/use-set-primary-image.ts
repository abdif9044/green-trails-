
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../use-toast';

export const useSetPrimaryImage = (trailId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (imageId: string) => {
      // First, unset all existing primary images for this trail
      const { error: unsetError } = await supabase
        .from('trail_images')
        .update({ is_primary: false })
        .eq('trail_id', trailId)
        .eq('is_primary', true);

      if (unsetError) throw unsetError;

      // Then set the new primary image
      const { error: setPrimaryError } = await supabase
        .from('trail_images')
        .update({ is_primary: true })
        .eq('id', imageId);

      if (setPrimaryError) throw setPrimaryError;

      return imageId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trail-images', trailId] });
      toast({
        title: "Primary image updated",
        description: "The image has been set as the primary trail image.",
      });
    },
    onError: (error) => {
      console.error('Error setting primary image:', error);
      toast({
        title: "Error",
        description: "Failed to set the primary image. Please try again.",
        variant: "destructive",
      });
    },
  });
};
