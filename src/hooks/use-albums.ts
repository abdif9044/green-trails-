
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAlbums = (filter: 'feed' | 'following') => {
  return useQuery({
    queryKey: ['albums', filter],
    queryFn: async () => {
      if (filter === 'following') {
        // Fetch albums from users we follow
        const { data: followingData } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', (await supabase.auth.getUser()).data.user?.id);

        const followingIds = followingData?.map(f => f.following_id) || [];

        if (followingIds.length === 0) {
          return []; // No followings, return empty array
        }

        const { data: albums, error } = await supabase
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

        return albums || [];
      }

      // Fetch all public albums for the feed
      const { data: albums, error } = await supabase
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

      return albums || [];
    }
  });
};
