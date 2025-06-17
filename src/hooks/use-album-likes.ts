
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
        // Try to query likes table with a function call since the table may not exist
        const { data, error } = await supabase
          .rpc('get_album_like_count', { album_id: albumId })
          .maybeSingle();
          
        if (error) {
          console.warn('Likes table may not exist:', error);
          return 0;
        }
        
        return data?.count || 0;
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
        // Try to query likes table with a function call since the table may not exist
        const { data, error } = await supabase
          .rpc('check_user_liked_album', { 
            album_id: albumId, 
            user_id: user.id 
          })
          .maybeSingle();
          
        if (error) {
          console.warn('Likes table may not exist:', error);
          return false;
        }
        
        return data?.liked || false;
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
      
      try {
        // Try to use a function call to handle likes since the table may not exist
        const { data, error } = await supabase
          .rpc('toggle_album_like', {
            album_id: albumId,
            user_id: user.id
          });
          
        if (error) {
          console.warn('Likes functionality not available:', error);
          throw new Error('Likes functionality is not yet available');
        }
        
        return data;
      } catch (error) {
        console.warn('Error toggling like, table may not exist:', error);
        throw new Error('Likes functionality is not yet available');
      }
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
