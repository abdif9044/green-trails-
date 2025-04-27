
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
      // Use execute_sql to query ratings with proper SQL interpolation
      const { data, error } = await supabase.rpc('execute_sql', {
        sql_query: `
          SELECT rating::integer, user_id, '${trailId}' as trail_id
          FROM (
            SELECT 
              CASE 
                WHEN EXISTS (SELECT 1 FROM trail_ratings WHERE trail_id = '${trailId}') 
                THEN (SELECT json_agg(r) FROM (SELECT rating, user_id FROM trail_ratings WHERE trail_id = '${trailId}') r)
                ELSE '[]'::json
              END as ratings
          ) sub, 
          json_array_elements(CASE WHEN ratings IS NULL THEN '[]'::json ELSE ratings END) as r
        `
      });

      if (error) throw error;
      
      // Process and transform the data into TrailRating[] format with proper type casting
      if (data && Array.isArray(data) && data.length > 0) {
        return data.map(item => {
          const record = item as Record<string, any>;
          return {
            rating: parseInt(record.rating || '0'),
            user_id: record.user_id as string,
            trail_id: trailId
          };
        }) as TrailRating[];
      }
      
      return [] as TrailRating[];
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

      // Create or update rating using execute_sql with proper parameter handling
      const { error } = await supabase.rpc('execute_sql', {
        sql_query: `
          WITH upsert AS (
            INSERT INTO trail_ratings (trail_id, user_id, rating)
            VALUES ('${trailId}', '${user.id}', ${rating})
            ON CONFLICT (trail_id, user_id) 
            DO UPDATE SET rating = EXCLUDED.rating, updated_at = now()
            RETURNING *
          )
          SELECT count(*) FROM upsert
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
