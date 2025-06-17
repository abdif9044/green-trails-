
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

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
