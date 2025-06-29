
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

interface TrailRating {
  rating: number;
  user_id: string;
  trail_id: string;
}

export const useTrailRatings = (trailId: string) => {
  return useQuery({
    queryKey: ['trail-ratings', trailId],
    queryFn: async () => {
      // For now, return mock data since the table doesn't exist yet
      const mockRatings: TrailRating[] = [
        { rating: 4, user_id: 'user1', trail_id: trailId },
        { rating: 5, user_id: 'user2', trail_id: trailId },
        { rating: 3, user_id: 'user3', trail_id: trailId }
      ];
      
      return mockRatings;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

export const useAddRating = (trailId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (rating: number) => {
      if (!user) throw new Error('Must be logged in to rate trails');

      // For now, just simulate success since the table doesn't exist yet
      console.log('Would add rating:', { trailId, userId: user.id, rating });
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trail-ratings', trailId] });
      toast({
        title: "Rating submitted",
        description: "Your rating has been saved successfully.",
      });
    },
    onError: (error: Error) => {
      console.error('Rating submission error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
