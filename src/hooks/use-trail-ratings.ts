
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
      // Use a raw SQL query instead of direct table access since types aren't updated
      const { data, error } = await supabase
        .rpc('execute_sql', {
          sql_query: `SELECT rating, user_id FROM trail_ratings WHERE trail_id = '${trailId}'`
        });

      if (error) throw error;
      return (data || []) as TrailRating[];
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

      // Use a raw SQL query for the upsert
      const { error } = await supabase
        .rpc('execute_sql', {
          sql_query: `
            INSERT INTO trail_ratings (trail_id, user_id, rating)
            VALUES ('${trailId}', '${user.id}', ${rating})
            ON CONFLICT (trail_id, user_id) 
            DO UPDATE SET rating = ${rating}, updated_at = now()
          `
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
