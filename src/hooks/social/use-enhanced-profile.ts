
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../use-toast';
import { useCreateNotification } from './use-notifications';

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
