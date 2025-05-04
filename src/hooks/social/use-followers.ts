
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Hook to get followers list
export const useFollowersList = (userId: string) => {
  return useQuery({
    queryKey: ['followers', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('follows')
        .select(`
          follower_id,
          profiles:follower_id (
            id, username, full_name, avatar_url
          )
        `)
        .eq('following_id', userId);
        
      if (error) throw error;
      return data || [];
    },
    enabled: Boolean(userId),
  });
};

// Hook to get follower counts
export const useFollowersCount = (userId: string) => {
  return useQuery({
    queryKey: ['followersCount', userId],
    queryFn: async () => {
      if (!userId) return 0;
      
      const { count, error } = await supabase
        .from('follows')
        .select('id', { count: 'exact', head: true })
        .eq('following_id', userId);
        
      if (error) throw error;
      return count || 0;
    },
    enabled: Boolean(userId),
  });
};
