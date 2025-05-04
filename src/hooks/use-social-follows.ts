
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { useAuth } from './use-auth';

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

// Hook to check if a user is following another user
export const useIsFollowing = (targetUserId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['isFollowing', user?.id, targetUserId],
    queryFn: async () => {
      if (!user?.id || !targetUserId) return false;
      
      const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .single();
        
      if (error && error.code !== 'PGRST116') return false; // PGRST116 is "no rows returned"
      return Boolean(data);
    },
    enabled: Boolean(user?.id && targetUserId),
  });
};

// Hook to toggle follow/unfollow
export const useToggleFollow = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);
  
  const mutate = async (targetUserId: string) => {
    if (!user?.id || !targetUserId || user.id === targetUserId) {
      toast({
        title: "Error",
        description: "Cannot follow/unfollow this user",
        variant: "destructive"
      });
      return;
    }
    
    setIsPending(true);
    
    try {
      // Check if already following
      const { data: existingFollow } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .single();
      
      if (existingFollow) {
        // Unfollow
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId);
          
        toast({
          title: "Unfollowed",
          description: "You have unfollowed this user"
        });
      } else {
        // Follow
        await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: targetUserId,
            created_at: new Date().toISOString()
          });
          
        toast({
          title: "Following",
          description: "You are now following this user"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive"
      });
    } finally {
      setIsPending(false);
    }
  };
  
  return { mutate, isPending };
};

// Hook to get follower and following counts
export const useFollowCounts = (userId: string) => {
  const followersQuery = useQuery({
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
  
  const followingQuery = useQuery({
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
  
  return {
    followersCount: followersQuery.data,
    followingCount: followingQuery.data,
    isLoading: followersQuery.isLoading || followingQuery.isLoading,
    isError: followersQuery.isError || followingQuery.isError
  };
};

// The combined hook for social follows
export const useSocialFollows = (userId?: string) => {
  const { data: followers = [], isLoading: isFollowersLoading } = useFollowersList(userId || '');
  const { data: following = [], isLoading: isFollowingLoading } = useFollowingList(userId || '');

  // Transform data to a more usable format
  const followingUsers = following.map(f => ({
    id: f.following_id,
    username: f.profiles?.username || '',
    full_name: f.profiles?.full_name || '',
    avatar_url: f.profiles?.avatar_url || ''
  }));
  
  const followerUsers = followers.map(f => ({
    id: f.follower_id,
    username: f.profiles?.username || '',
    full_name: f.profiles?.full_name || '',
    avatar_url: f.profiles?.avatar_url || ''
  }));

  return {
    followingUsers,
    followerUsers,
    isLoading: isFollowersLoading || isFollowingLoading
  };
};
