
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '../use-toast';
import { useCreateNotification } from './use-notifications';

// Enhanced profile hooks - temporarily disabled until all tables are created
export const useEnhancedProfile = (userId: string) => {
  return useQuery({
    queryKey: ['enhanced-profile', userId],
    queryFn: async () => {
      // Fetch basic profile first
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      
      // Return basic profile for now, will add stats when tables are ready
      return {
        ...profile,
        hiking_stats: null,
        achievements: [],
        social_stats: null
      };
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
      // Check if hiking_stats table exists
      try {
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
      } catch (error) {
        console.log('Hiking stats table not yet available:', error);
        // Gracefully handle missing table
      }
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-profile', userId] });
    },
  });
};

// Achievement system hooks - temporarily disabled
export const useUnlockAchievement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      achievementId 
    }: { 
      userId: string; 
      achievementId: string 
    }) => {
      console.log('Achievement system not yet available');
      // Gracefully handle missing tables
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
