
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  user?: {
    id: string;
    email: string;
  } | null; // Make user optional and nullable to handle error cases
}

export const useAlbums = (userId?: string) => {
  return useQuery({
    queryKey: ['albums', userId],
    queryFn: async () => {
      // If userId is provided, fetch albums for that user
      if (userId) {
        const { data, error } = await supabase
          .from('albums')
          .select(`
            *,
            user:user_id (
              id,
              email
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching user albums:', error);
          return [];
        }

        // Handle the case where relation might not be found
        return data.map(album => ({
          ...album,
          user: album.user && typeof album.user === 'object' ? album.user : null
        })) as Album[];
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
      return data.map(album => ({
        ...album,
        user: album.user && typeof album.user === 'object' ? album.user : null
      })) as Album[];
    },
    enabled: true,
  });
};
