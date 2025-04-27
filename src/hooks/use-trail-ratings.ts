
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

/**
 * Represents a trail rating submitted by a user
 */
interface TrailRating {
  rating: number;
  user_id: string;
  trail_id: string;
}

/**
 * Hook to fetch trail ratings
 * @param trailId - The unique identifier of the trail
 * @returns An object containing trail ratings, loading state, and error information
 */
export const useTrailRatings = (trailId: string) => {
  return useQuery({
    queryKey: ['trail-ratings', trailId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('execute_sql', {
        sql_query: `
          SELECT rating, user_id, trail_id
          FROM trail_ratings
          WHERE trail_id = $1
        `,
        params: JSON.stringify([trailId])
      });

      if (error) {
        console.error('Error fetching trail ratings:', error);
        throw error;
      }
      
      return (data || []).map(item => {
        const rating = item as Record<string, any>;
        return {
          rating: Number(rating.rating),
          user_id: String(rating.user_id),
          trail_id: String(rating.trail_id)
        };
      }) as TrailRating[];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

/**
 * Hook to add or update a trail rating
 * @param trailId - The unique identifier of the trail
 * @returns A mutation object for adding/updating ratings
 */
export const useAddRating = (trailId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (rating: number) => {
      if (!user) throw new Error('Must be logged in to rate trails');

      const { error } = await supabase.rpc('execute_sql', {
        sql_query: `
          INSERT INTO trail_ratings (trail_id, user_id, rating)
          VALUES ($1, $2, $3)
          ON CONFLICT (trail_id, user_id) 
          DO UPDATE SET rating = EXCLUDED.rating, updated_at = now()
        `,
        params: JSON.stringify([trailId, user.id, rating])
      });

      if (error) {
        console.error('Error adding trail rating:', error);
        throw error;
      }
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
