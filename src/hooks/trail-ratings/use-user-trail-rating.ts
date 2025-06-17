
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

export const useUserTrailRating = (trailId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-trail-rating', user?.id, trailId],
    queryFn: async () => {
      if (!user) return null;
      
      try {
        const { data, error } = await supabase
          .from('trail_ratings')
          .select('*')
          .eq('trail_id', trailId)
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user trail rating:', error);
          return null;
        }

        return data;
      } catch (error) {
        console.error('Error fetching user trail rating:', error);
        return null;
      }
    },
    enabled: !!user && !!trailId,
  });
};
