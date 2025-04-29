
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
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: false });

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

export const useDeleteTrailImage = (trailId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (imageId: string) => {
      // Get image path and check if it's primary
      const { data: imageData } = await supabase
        .from('trail_images')
        .select('image_path, is_primary')
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
