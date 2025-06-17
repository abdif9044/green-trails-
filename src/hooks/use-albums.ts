
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
    queryFn: async (): Promise<Album[]> => {
      try {
        // Since albums table doesn't exist, return empty array as fallback
        console.warn('Albums table does not exist, returning empty array');
        return [];
      } catch (error) {
        console.error('Error fetching albums:', error);
        return [];
      }
    },
    enabled: true,
  });
};

// Helper function to add cover images to albums (placeholder for when albums table exists)
const addCoverImageToAlbums = async (albums: Album[]): Promise<Album[]> => {
  if (!albums || albums.length === 0) return [];
  
  // This would normally fetch cover images from the media table
  // For now, just return albums as-is since neither table exists
  return albums;
};
