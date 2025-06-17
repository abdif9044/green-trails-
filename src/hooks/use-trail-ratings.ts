
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export const useTrailRating = (trailId: string) => {
  return useQuery({
    queryKey: ['trail-rating', trailId],
    queryFn: async () => {
      try {
        // Since trail_ratings table doesn't exist, return mock data
        console.warn('Trail ratings table does not exist, returning mock data');
        return {
          average_rating: 4.2,
          total_ratings: 0,
        };
      } catch (error) {
        console.error('Error fetching trail rating:', error);
        return {
          average_rating: 0,
          total_ratings: 0,
        };
      }
    },
    enabled: !!trailId,
  });
};

export const useUserTrailRating = (trailId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-trail-rating', user?.id, trailId],
    queryFn: async () => {
      if (!user) return null;
      
      try {
        // Since trail_ratings table doesn't exist, return null
        console.warn('Trail ratings table does not exist, returning null');
        return null;
      } catch (error) {
        console.error('Error fetching user trail rating:', error);
        return null;
      }
    },
    enabled: !!user && !!trailId,
  });
};

export const useSubmitTrailRating = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ trailId, rating }: { trailId: string; rating: number }) => {
      if (!user) {
        throw new Error('You must be logged in to rate trails');
      }

      // Since trail_ratings table doesn't exist, show appropriate message
      throw new Error('Trail ratings feature is not yet available');
    },
    onSuccess: (_, { trailId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['trail-rating', trailId] });
      queryClient.invalidateQueries({ queryKey: ['user-trail-rating'] });
      
      toast({
        title: 'Rating submitted',
        description: 'Thank you for rating this trail!',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Feature not available',
        description: 'Trail ratings feature is coming soon!',
        variant: 'default',
      });
    },
  });
};
