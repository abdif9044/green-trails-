
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

interface CreateAlbumData {
  title: string;
  description?: string;
  location?: string;
  is_private: boolean;
  trail_id?: string;
}

interface MediaFile {
  file: File;
  caption?: string;
}

export const useCreateAlbum = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ albumData, mediaFiles }: { albumData: CreateAlbumData; mediaFiles: MediaFile[] }) => {
      if (!user) {
        throw new Error('User must be logged in to create an album');
      }

      // Since albums table doesn't exist, show appropriate message
      toast({
        title: "Feature coming soon",
        description: "Album creation will be available once the albums feature is fully implemented.",
        variant: "default",
      });
      
      throw new Error('Albums feature is not yet available');
    },
    onSuccess: () => {
      // Invalidate and refetch albums
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      
      toast({
        title: 'Album created',
        description: 'Your album has been created successfully.',
      });
    },
    onError: (error: Error) => {
      if (error.message !== 'Albums feature is not yet available') {
        toast({
          title: 'Error creating album',
          description: error.message || 'Failed to create album. Please try again.',
          variant: 'destructive',
        });
      }
    },
  });
};

// Mock function for media upload since media table doesn't exist
const uploadMediaFiles = async (albumId: string, mediaFiles: MediaFile[]) => {
  // This would normally upload files to Supabase storage and create media records
  console.warn('Media upload not implemented - media table does not exist');
  return [];
};
