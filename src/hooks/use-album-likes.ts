
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';

// Get like count for an album - with fallback for missing table
export const useAlbumLikeCount = (albumId: string) => {
  return useQuery({
    queryKey: ['albumLikes', albumId],
    queryFn: async () => {
      try {
        // Since likes table doesn't exist, return 0 as fallback
        console.warn('Likes table does not exist, returning 0');
        return 0;
      } catch (error) {
        console.warn('Error fetching like count, table may not exist:', error);
        return 0;
      }
    },
    enabled: !!albumId,
  });
};

// Check if current user has liked an album - with fallback for missing table
export const useHasLikedAlbum = (albumId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userLikedAlbum', user?.id, albumId],
    queryFn: async () => {
      if (!user) return false;
      
      try {
        // Since likes table doesn't exist, return false as fallback
        console.warn('Likes table does not exist, returning false');
        return false;
      } catch (error) {
        console.warn('Error checking if user liked album, table may not exist:', error);
        return false;
      }
    },
    enabled: !!user && !!albumId,
  });
};

// Like/unlike an album - with graceful handling of missing table
export const useToggleAlbumLike = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (albumId: string) => {
      if (!user) {
        throw new Error('You must be logged in to like albums');
      }
      
      // Since likes table doesn't exist, throw appropriate error
      throw new Error('Likes functionality is not yet available');
    },
    onSuccess: (result) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['albumLikes'] });
      queryClient.invalidateQueries({ queryKey: ['userLikedAlbum'] });
      
      // Show success message
      toast({
        title: 'Action completed',
        description: 'Like status updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Feature not available',
        description: 'Album likes feature is coming soon!',
        variant: 'default',
      });
    },
  });
};
