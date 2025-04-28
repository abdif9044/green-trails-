
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { v4 as uuidv4 } from 'uuid';

export interface TrailImage {
  id: string;
  trail_id: string;
  image_path: string;
  is_primary: boolean;
  caption?: string;
  created_at: string;
  user_id: string;
}

export const useTrailImages = (trailId: string) => {
  return useQuery({
    queryKey: ['trail-images', trailId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trail_images')
        .select('*')
        .eq('trail_id', trailId)
        .order('is_primary', { ascending: false });

      if (error) throw error;
      return data as TrailImage[];
    }
  });
};

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
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('trail_images')
        .getPublicUrl(filePath);

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

export const useDeleteTrailImage = (trailId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (imageId: string) => {
      // Get image path first
      const { data: imageData } = await supabase
        .from('trail_images')
        .select('image_path')
        .eq('id', imageId)
        .single();

      if (imageData?.image_path) {
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('trail_images')
          .remove([imageData.image_path]);

        if (storageError) throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('trail_images')
        .delete()
        .eq('id', imageId);

      if (dbError) throw dbError;
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
