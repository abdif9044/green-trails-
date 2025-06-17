
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export const useTrailRating = (trailId: string) => {
  return useQuery({
    queryKey: ['trail-rating', trailId],
    queryFn: async () => {
      try {
        // Get average rating and total count
        const { data, error } = await supabase
          .from('trail_ratings')
          .select('rating')
          .eq('trail_id', trailId);

        if (error) {
          console.error('Error fetching trail rating:', error);
          return {
            average_rating: 0,
            total_ratings: 0,
          };
        }

        if (!data || data.length === 0) {
          return {
            average_rating: 0,
            total_ratings: 0,
          };
        }

        const total = data.length;
        const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
        const average = sum / total;

        return {
          average_rating: average,
          total_ratings: total,
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

export const useTrailRatings = (trailId: string) => {
  return useQuery({
    queryKey: ['trail-ratings', trailId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('trail_ratings')
          .select('*')
          .eq('trail_id', trailId);

        if (error) {
          console.error('Error fetching trail ratings:', error);
          return [];
        }

        return data || [];
      } catch (error) {
        console.error('Error fetching trail ratings:', error);
        return [];
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

export const useAddRating = (trailId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (rating: number) => {
      if (!user) {
        throw new Error('You must be logged in to rate trails');
      }

      const { data, error } = await supabase
        .from('trail_ratings')
        .upsert({
          trail_id: trailId,
          user_id: user.id,
          rating: rating,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['trail-rating', trailId] });
      queryClient.invalidateQueries({ queryKey: ['trail-ratings', trailId] });
      queryClient.invalidateQueries({ queryKey: ['user-trail-rating'] });
      
      toast({
        title: 'Rating submitted',
        description: 'Thank you for rating this trail!',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error submitting rating',
        description: error.message || 'Failed to submit rating. Please try again.',
        variant: 'destructive',
      });
    },
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

      const { data, error } = await supabase
        .from('trail_ratings')
        .upsert({
          trail_id: trailId,
          user_id: user.id,
          rating: rating,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
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
        title: 'Error submitting rating',
        description: error.message || 'Failed to submit rating. Please try again.',
        variant: 'destructive',
      });
    },
  });
};
