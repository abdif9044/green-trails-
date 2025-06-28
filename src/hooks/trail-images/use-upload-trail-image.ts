
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook to upload a new image for a trail
 */
export const useUploadTrailImage = (trailId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      file, 
      caption, 
      isPrimary = false 
    }: { 
      file: File; 
      caption?: string; 
      isPrimary?: boolean;
    }) => {
      if (!user) throw new Error('Must be logged in to upload images');

      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${trailId}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('trail_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('trail_images')
        .getPublicUrl(filePath);

      // If this is set as primary, remove primary status from other images first
      if (isPrimary) {
        const { error: updateError } = await supabase
          .from('trail_images')
          .update({ is_primary: false })
          .eq('trail_id', trailId)
          .eq('is_primary', true);
        
        if (updateError) throw updateError;
      }

      // Save image metadata to database
      const { error: dbError } = await supabase
        .from('trail_images')
        .insert({
          trail_id: trailId,
          image_path: filePath,
          is_primary: isPrimary,
          caption,
          user_id: user.id
        });

      if (dbError) throw dbError;

      return publicUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trail-images', trailId] });
      toast({
        title: "Success",
        description: "Image uploaded successfully",
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
