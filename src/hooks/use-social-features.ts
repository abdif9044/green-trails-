
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';

// Notification hooks
export const useNotifications = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      type, 
      title, 
      message, 
      data 
    }: {
      userId: string;
      type: string;
      title: string;
      message: string;
      data?: Record<string, any>;
    }) => {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          data,
          read: false
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    },
  });
};

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
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to join group. You may already be a member.",
        variant: "destructive",
      });
    },
  });
};

// Events/hikes hooks
export const useHikingEvents = () => {
  return useQuery({
    queryKey: ['hiking-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hiking_events')
        .select(`
          *,
          organizer:organizer_id(id, username, full_name, avatar_url),
          attendees:event_attendees(
            user_id,
            status,
            user:user_id(id, username, full_name, avatar_url)
          )
        `)
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useRSVPEvent = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ 
      eventId, 
      status 
    }: { 
      eventId: string; 
      status: 'going' | 'maybe' | 'declined' 
    }) => {
      if (!user) throw new Error('Must be logged in to RSVP');
      
      const { error } = await supabase
        .from('event_attendees')
        .upsert({
          event_id: eventId,
          user_id: user.id,
          status,
          rsvp_at: new Date().toISOString()
        }, {
          onConflict: 'event_id,user_id'
        });
      
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['hiking-events'] });
      toast({
        title: "RSVP Updated",
        description: `You're now marked as "${status}" for this hike.`,
      });
    },
  });
};

// Enhanced profile hooks
export const useEnhancedProfile = (userId: string) => {
  return useQuery({
    queryKey: ['enhanced-profile', userId],
    queryFn: async () => {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          hiking_stats(*),
          achievements(*),
          social_stats(*)
        `)
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      return profile;
    },
    enabled: !!userId,
  });
};

export const useUpdateHikingStats = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      stats 
    }: { 
      userId: string; 
      stats: Record<string, any> 
    }) => {
      const { error } = await supabase
        .from('hiking_stats')
        .upsert({
          user_id: userId,
          ...stats,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
      
      if (error) throw error;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-profile', userId] });
    },
  });
};

// Achievement system hooks
export const useUnlockAchievement = () => {
  const queryClient = useQueryClient();
  const createNotification = useCreateNotification();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      achievementId 
    }: { 
      userId: string; 
      achievementId: string 
    }) => {
      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_id: achievementId,
          unlocked_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      // Get achievement details for notification
      const { data: achievement } = await supabase
        .from('achievements')
        .select('name, description')
        .eq('id', achievementId)
        .single();
      
      if (achievement) {
        await createNotification.mutateAsync({
          userId,
          type: 'achievement',
          title: 'Achievement Unlocked!',
          message: `You've unlocked "${achievement.name}": ${achievement.description}`,
          data: { achievementId }
        });
      }
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-profile', userId] });
      toast({
        title: "Achievement Unlocked! 🏆",
        description: "Check your profile to see your new achievement.",
      });
    },
  });
};
