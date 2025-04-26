
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';

// Get like count for an album
export const useAlbumLikeCount = (albumId: string) => {
  return useQuery({
    queryKey: ['albumLikes', albumId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('media_id', albumId);
        
      if (error) {
        console.error('Error fetching like count:', error);
        return 0;
      }
      
      return count || 0;
    },
    enabled: !!albumId,
  });
};

// Check if current user has liked an album
export const useHasLikedAlbum = (albumId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userLikedAlbum', user?.id, albumId],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('media_id', albumId)
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (error) {
        console.error('Error checking if user liked album:', error);
        return false;
      }
      
      return !!data;
    },
    enabled: !!user && !!albumId,
  });
};

// Like/unlike an album
export const useToggleAlbumLike = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (albumId: string) => {
      if (!user) {
        throw new Error('You must be logged in to like albums');
      }
      
      // Check if user has already liked this album
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('media_id', albumId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (existingLike) {
        // Unlike: remove the existing like
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);
          
        if (error) throw error;
        return { action: 'unliked', albumId };
      } else {
        // Like: add a new like
        const { error } = await supabase
          .from('likes')
          .insert({
            media_id: albumId,
            user_id: user.id
          });
          
        if (error) throw error;
        return { action: 'liked', albumId };
      }
    },
    onSuccess: (result) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['albumLikes', result.albumId] });
      queryClient.invalidateQueries({ queryKey: ['userLikedAlbum', user?.id, result.albumId] });
      
      // Show success message
      toast({
        title: result.action === 'liked' ? 'Album liked' : 'Album unliked',
        description: result.action === 'liked' 
          ? 'You have liked this album' 
          : 'You have unliked this album',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Action failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
