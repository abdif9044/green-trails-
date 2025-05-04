
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../use-toast';
import { useAuth } from '../use-auth';
import { useQuery } from '@tanstack/react-query';

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
