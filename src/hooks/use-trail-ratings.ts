
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
      const { data, error } = await supabase.rpc('execute_sql', {
        sql_query: `
          SELECT rating, user_id, trail_id
          FROM trail_ratings
          WHERE trail_id = $1
        `,
        params: JSON.stringify([trailId])
      });

      if (error) throw error;
      
      return (data || []).map(item => {
        // Explicitly type the item as a Record<string, any>
        const rating = item as Record<string, any>;
        return {
          rating: Number(rating.rating),
          user_id: String(rating.user_id),
          trail_id: String(rating.trail_id)
        };
      }) as TrailRating[];
    },
  });
};

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

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trail-ratings', trailId] });
      toast({
        title: "Rating submitted",
        description: "Your rating has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
