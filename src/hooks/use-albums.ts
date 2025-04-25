
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

        const { data: albums } = await supabase
          .from('albums')
          .select(`
            *,
            user:user_id (
              email
            )
          `)
          .in('user_id', followingIds)
          .order('created_at', { ascending: false });

        return albums || [];
      }

      // Fetch all public albums for the feed
      const { data: albums } = await supabase
        .from('albums')
        .select(`
          *,
          user:user_id (
            email
          )
        `)
        .eq('is_private', false)
        .order('created_at', { ascending: false });

      return albums || [];
    }
  });
};
