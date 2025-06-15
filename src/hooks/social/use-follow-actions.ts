import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../use-toast';
import { useAuth } from '../use-auth';
import { useQuery } from '@tanstack/react-query';
import { logSocialAction } from './use-follow-audit';

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
        title: "Oops",
        description: "Cannot follow/unfollow yourself.",
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
        
        logSocialAction('unfollow', user.id, targetUserId);
        toast({
          title: "Unfollowed!",
          description: "You have unfollowed this user.",
          variant: "default"
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
        
        logSocialAction('follow', user.id, targetUserId);
        toast({
          title: "Now following!",
          description: "You are following this user.",
          variant: "default"
        });
      }
    } catch (error: any) {
      toast({
        title: "Action failed",
        description: error.message || "Could not update follow.",
        variant: "destructive"
      });
    } finally {
      setIsPending(false);
    }
  };
  
  return { mutate, isPending };
};
