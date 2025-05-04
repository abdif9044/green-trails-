
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Hook to get following list
export const useFollowingList = (userId: string) => {
  return useQuery({
    queryKey: ['following', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('follows')
        .select(`
          following_id,
          profiles:following_id (
            id, username, full_name, avatar_url
          )
        `)
        .eq('follower_id', userId);
        
      if (error) throw error;
      return data || [];
    },
    enabled: Boolean(userId),
  });
};

// Hook to get following counts
export const useFollowingCount = (userId: string) => {
  return useQuery({
    queryKey: ['followingCount', userId],
    queryFn: async () => {
      if (!userId) return 0;
      
      const { count, error } = await supabase
        .from('follows')
        .select('id', { count: 'exact', head: true })
        .eq('follower_id', userId);
        
      if (error) throw error;
      return count || 0;
    },
    enabled: Boolean(userId),
  });
};
