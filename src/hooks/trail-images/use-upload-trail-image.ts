
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../use-auth';
import { useToast } from '../use-toast';
import { v4 as uuidv4 } from 'uuid';

interface UploadTrailImageData {
  file: File;
  caption?: string;
  isPrimary?: boolean;
}

export const useUploadTrailImage = (trailId: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ file, caption, isPrimary = false }: UploadTrailImageData) => {
      if (!user) throw new Error('User must be authenticated');

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${trailId}/${uuidv4()}.${fileExt}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('trail-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // If setting as primary, unset existing primary images
      if (isPrimary) {
        await supabase
          .from('trail_images')
          .update({ is_primary: false })
          .eq('trail_id', trailId)
          .eq('is_primary', true);
      }

      // Create database record
      const { data: imageRecord, error: dbError } = await supabase
        .from('trail_images')
        .insert({
          trail_id: trailId,
          image_path: fileName,
          caption: caption || '',
          is_primary: isPrimary,
          user_id: user.id,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return imageRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trail-images', trailId] });
      toast({
        title: "Image uploaded",
        description: "Your trail image has been uploaded successfully.",
      });
    },
    onError: (error) => {
      console.error('Error uploading trail image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload the image. Please try again.",
        variant: "destructive",
      });
    },
  });
};
