
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../use-auth';
import { useToast } from '../use-toast';

// Social groups hooks
export const useSocialGroups = (searchQuery?: string) => {
  return useQuery({
    queryKey: ['social-groups', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('social_groups')
        .select(`
          *,
          owner:owner_id(id, username, full_name, avatar_url),
          members:group_members(count)
        `)
        .eq('is_private', false)
        .order('created_at', { ascending: false });
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useJoinGroup = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (groupId: string) => {
      if (!user) throw new Error('Must be logged in to join group');
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: user.id,
          role: 'member',
          joined_at: new Date().toISOString()
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-groups'] });
      toast({
        title: "Joined group!",
        description: "You've successfully joined the hiking group.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to join group. You may already be a member.",
        variant: "destructive",
      });
    },
  });
};
