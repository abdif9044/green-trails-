
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../use-auth';
import { useToast } from '../use-toast';

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('follows')
        .insert({
          follower_id: user.id,
          following_id: targetUserId,
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({ queryKey: ['following'] });
      toast({
        title: "Success",
        description: "You are now following this user.",
      });
    },
    onError: (error) => {
      console.error('Follow error:', error);
      toast({
        title: "Error",
        description: "Failed to follow user.",
        variant: "destructive",
      });
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({ queryKey: ['following'] });
      toast({
        title: "Success",
        description: "You have unfollowed this user.",
      });
    },
    onError: (error) => {
      console.error('Unfollow error:', error);
      toast({
        title: "Error",
        description: "Failed to unfollow user.",
        variant: "destructive",
      });
    },
  });
};

// Check if current user is following a specific user
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
        
      if (error) {
        console.error('Error checking if following:', error);
        return false;
      }
      
      return !!data;
    },
    enabled: !!user && !!targetUserId,
  });
};

// Toggle follow/unfollow
export const useToggleFollow = () => {
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ targetUserId, isFollowing }: { targetUserId: string; isFollowing: boolean }) => {
      if (!user) throw new Error('User not authenticated');
      
      if (isFollowing) {
        return unfollowUser.mutateAsync(targetUserId);
      } else {
        return followUser.mutateAsync(targetUserId);
      }
    },
  });
};
