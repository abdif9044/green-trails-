
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  website_url: string;
  email: string;
  stats: {
    totalTrails: number;
    totalDistance: number;
    totalElevation: number;
    currentStreak: number;
  };
  followers: number;
  following: number;
  recentActivities: Array<{
    id: string;
    type: string;
    trail_name?: string;
    created_at: string;
  }>;
}

export const useEnhancedProfile = (userId: string) => {
  return useQuery({
    queryKey: ['enhanced-profile', userId],
    queryFn: async (): Promise<EnhancedProfile | null> => {
      if (!userId) return null;

      try {
        // Get basic profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          return null;
        }

        // Get user stats - using the correct table name
        const { data: stats, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (statsError) {
          console.log('No stats found for user, using defaults');
        }

        // Get follower/following counts
        const { data: followerData, error: followerError } = await supabase
          .from('follows')
          .select('id')
          .eq('following_id', userId);

        const { data: followingData, error: followingError } = await supabase
          .from('follows')
          .select('id')
          .eq('follower_id', userId);

        // Get recent activities
        const { data: activities, error: activitiesError } = await supabase
          .from('activity_feed')
          .select(`
            id,
            type,
            content,
            created_at,
            trails:trail_id(name)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10);

        return {
          id: profile.id,
          username: profile.username || '',
          full_name: profile.full_name || '',
          avatar_url: profile.avatar_url || '',
          bio: profile.bio || '',
          website_url: profile.website_url || '',
          email: profile.email || '',
          stats: {
            totalTrails: stats?.total_trails || 0,
            totalDistance: stats?.total_distance || 0,
            totalElevation: stats?.total_elevation || 0,
            currentStreak: stats?.current_streak || 0,
          },
          followers: followerData?.length || 0,
          following: followingData?.length || 0,
          recentActivities: activities?.map(activity => ({
            id: activity.id,
            type: activity.type,
            trail_name: (activity.trails as any)?.name || '',
            created_at: activity.created_at,
          })) || [],
        };
      } catch (error) {
        console.error('Error fetching enhanced profile:', error);
        return null;
      }
    },
    enabled: !!userId,
  });
};
