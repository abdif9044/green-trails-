
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
  } | null; // Make user optional and nullable to handle error cases
}

export const useAlbums = (filterType?: AlbumFilterType) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['albums', filterType, user?.id],
    queryFn: async () => {
      // If we're in the "following" tab and the user is logged in
      if (filterType === 'following' && user) {
        // First get the users the current user is following
        const { data: followingData, error: followingError } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', user.id);
          
        if (followingError) {
          console.error('Error fetching following users:', followingError);
          return [];
        }
        
        // If the user isn't following anyone, return empty array
        if (!followingData || followingData.length === 0) {
          return [];
        }
        
        // Extract the IDs of followed users
        const followingIds = followingData.map(item => item.following_id);
        
        // Get albums from followed users
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
          .eq('is_private', false)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching following albums:', error);
          return [];
        }
        
        // Handle the case where relation might not be found
        const albums = data.map(album => ({
          ...album,
          user: album.user && typeof album.user === 'object' ? album.user : null
        })) as Album[];
        
        // Get cover images for each album
        return await addCoverImageToAlbums(albums);
      }
      
      // If specific user ID provided
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

        // Handle the case where relation might not be found
        const albums = data.map(album => ({
          ...album,
          user: album.user && typeof album.user === 'object' ? album.user : null
        })) as Album[];
        
        // Get cover images for each album
        return await addCoverImageToAlbums(albums);
      }
      
      // If trail ID is provided
      if (filterType && !filterType.includes('-')) {
        const { data, error } = await supabase
          .from('albums')
          .select(`
            *,
            user:user_id (
              id,
              email
            )
          `)
          .eq('trail_id', filterType)
          .eq('is_private', false)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching trail albums:', error);
          return [];
        }

        // Handle the case where relation might not be found
        const albums = data.map(album => ({
          ...album,
          user: album.user && typeof album.user === 'object' ? album.user : null
        })) as Album[];
        
        // Get cover images for each album
        return await addCoverImageToAlbums(albums);
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
        .eq('is_private', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching feed albums:', error);
        return [];
      }

      // Handle the case where relation might not be found
      const albums = data.map(album => ({
        ...album,
        user: album.user && typeof album.user === 'object' ? album.user : null
      })) as Album[];
      
      // Get cover images for each album
      return await addCoverImageToAlbums(albums);
    },
    enabled: true,
  });
};

// Helper function to add cover images to albums
const addCoverImageToAlbums = async (albums: Album[]): Promise<Album[]> => {
  if (!albums || albums.length === 0) return [];
  
  const albumsWithCoverImage = await Promise.all(
    albums.map(async (album) => {
      // Get first media item for this album as the cover image
      const { data, error } = await supabase
        .from('media')
        .select('file_path')
        .eq('album_id', album.id)
        .limit(1)
        .single();
      
      if (error || !data) {
        return album;
      }
      
      // Generate the public URL for the file
      const coverImageUrl = supabase.storage
        .from('media')
        .getPublicUrl(data.file_path).data.publicUrl;
      
      return {
        ...album,
        coverImage: coverImageUrl
      };
    })
  );
  
  return albumsWithCoverImage;
};
