
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
