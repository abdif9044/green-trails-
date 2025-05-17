
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to set a trail image as the primary image
 */
export const useSetPrimaryImage = (trailId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (imageId: string) => {
      // First, set all images to not primary
      const { error: updateError } = await supabase
        .from('trail_images')
        .update({ is_primary: false })
        .eq('trail_id', trailId);
      
      if (updateError) throw updateError;
      
      // Then, set the selected image as primary
      const { error: setPrimaryError } = await supabase
        .from('trail_images')
        .update({ is_primary: true })
        .eq('id', imageId);
        
      if (setPrimaryError) throw setPrimaryError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trail-images', trailId] });
      toast({
        title: "Success",
        description: "Primary image updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};
