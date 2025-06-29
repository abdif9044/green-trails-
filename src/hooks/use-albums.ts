
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

// Define proper types for filtering
export type AlbumFilterType = 'feed' | 'following' | string;

export interface Album {
  id: string;
  title: string;
  description?: string;
  location?: string;
  is_private: boolean;
  user_id: string;
  trail_id?: string;
  created_at: string;
  updated_at: string;
  coverImage?: string;
  user?: {
    id: string;
    email: string;
  } | null;
}

export const useAlbums = (filterType?: AlbumFilterType) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['albums', filterType, user?.id],
    queryFn: async () => {
      // Handle different filter types
      if (filterType === 'following' && user) {
        // Get albums from followed users
        const { data: followingData, error: followingError } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', user.id);
          
        if (followingError) {
          console.error('Error fetching following users:', followingError);
          return [];
        }
        
        if (!followingData || followingData.length === 0) {
          return [];
        }
        
        const followingIds = followingData.map(item => item.following_id);
        
        const { data, error } = await supabase
          .from('albums')
          .select(`
            *,
            user:user_id (
              id,
              email
            )
          `)
          .in('user_id', followingIds)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching following albums:', error);
          return [];
        }
        
        return await addCoverImageToAlbums(data as any[]);
      }
      
      // Handle specific user ID
      if (filterType && filterType !== 'feed' && filterType !== 'following') {
        const { data, error } = await supabase
          .from('albums')
          .select(`
            *,
            user:user_id (
              id,
              email
            )
          `)
          .eq('user_id', filterType)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching user albums:', error);
          return [];
        }

        return await addCoverImageToAlbums(data as any[]);
      }

      // Default: fetch all public albums
      const { data, error } = await supabase
        .from('albums')
        .select(`
          *,
          user:user_id (
            id,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching albums:', error);
        return [];
      }

      return await addCoverImageToAlbums(data as any[]);
    },
    enabled: true,
  });
};

// Helper function to add cover images to albums
const addCoverImageToAlbums = async (albums: any[]): Promise<Album[]> => {
  if (!albums || albums.length === 0) return [];
  
  const albumsWithCoverImage = await Promise.all(
    albums.map(async (album) => {
      // For now, we'll use a placeholder cover image
      // In a real implementation, you'd fetch the first media item from album_media
      const coverImageUrl = '/placeholder.svg';
      
      return {
        id: album.id,
        title: album.title,
        description: album.description,
        location: album.location,
        is_private: album.is_private ?? false,
        user_id: album.user_id,
        trail_id: album.trail_id,
        created_at: album.created_at,
        updated_at: album.updated_at,
        coverImage: coverImageUrl,
        user: album.user && typeof album.user === 'object' ? album.user : null
      } as Album;
    })
  );
  
  return albumsWithCoverImage;
};
