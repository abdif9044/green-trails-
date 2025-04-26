import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';

type Profile = {
  username: string | null;
  avatar_url: string | null;
  full_name: string | null;
};

type FollowsResponse = {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
  profiles: Profile | null;
};

export const useFollowersList = (userId: string) => {
  return useQuery({
    queryKey: ['followers', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('follows')
        .select(`
          id,
          follower_id,
          following_id,
          created_at,
          profiles:follower_id(username, avatar_url, full_name)
        `)
        .eq('following_id', userId);
        
      if (error) throw error;
      
      // Transform the data to ensure it matches FollowsResponse type
      const transformedData = data?.map(item => ({
        ...item,
        profiles: item.profiles && typeof item.profiles === 'object' ? item.profiles as Profile : null
      })) as FollowsResponse[];
      
      return transformedData || [];
    },
    enabled: !!userId,
  });
};

export const useFollowingList = (userId: string) => {
  return useQuery({
    queryKey: ['following', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('follows')
        .select(`
          id,
          follower_id,
          following_id,
          created_at,
          profiles:following_id(username, avatar_url, full_name)
        `)
        .eq('follower_id', userId);
        
      if (error) throw error;
      
      // Transform the data to ensure it matches FollowsResponse type
      const transformedData = data?.map(item => ({
        ...item,
        profiles: item.profiles && typeof item.profiles === 'object' ? item.profiles as Profile : null
      })) as FollowsResponse[];
      
      return transformedData || [];
    },
    enabled: !!userId,
  });
};

export const useIsFollowing = (targetUserId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['isFollowing', user?.id, targetUserId],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .maybeSingle();
        
      if (error) throw error;
      return !!data;
    },
    enabled: !!user && !!targetUserId,
  });
};

export const useToggleFollow = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (targetUserId: string) => {
      if (!user) throw new Error('Must be logged in to follow users');
      if (user.id === targetUserId) throw new Error('Cannot follow yourself');
      
      // Check if already following
      const { data: existingFollow } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .maybeSingle();
      
      if (existingFollow) {
        // Unfollow
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('id', existingFollow.id);
          
        if (error) throw error;
        return { action: 'unfollowed', targetUserId };
      } else {
        // Follow
        const { error } = await supabase
          .from('follows')
          .insert([{
            follower_id: user.id,
            following_id: targetUserId
          }]);
          
        if (error) throw error;
        return { action: 'followed', targetUserId };
      }
    },
    onSuccess: (result) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['followers', result.targetUserId] });
      queryClient.invalidateQueries({ queryKey: ['following', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['isFollowing', user?.id, result.targetUserId] });
      
      // Show toast
      toast({
        title: result.action === 'followed' ? "Followed Successfully" : "Unfollowed Successfully",
        description: result.action === 'followed' 
          ? "You are now following this user." 
          : "You have unfollowed this user.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Action Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};

export const useFollowCounts = (userId: string) => {
  const followersQuery = useQuery({
    queryKey: ['followerCount', userId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId);
        
      if (error) throw error;
      return count || 0;
    },
    enabled: !!userId,
  });
  
  const followingQuery = useQuery({
    queryKey: ['followingCount', userId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId);
        
      if (error) throw error;
      return count || 0;
    },
    enabled: !!userId,
  });
  
  return {
    followersCount: followersQuery.data ?? 0,
    followingCount: followingQuery.data ?? 0,
    isLoading: followersQuery.isLoading || followingQuery.isLoading,
    error: followersQuery.error || followingQuery.error,
  };
};
