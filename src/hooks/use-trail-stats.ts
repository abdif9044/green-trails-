
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Represents trail statistics including visits, ratings, and comments
 */
interface TrailStats {
  visit_count: number;
  completion_count: number;
  avg_rating: number;
  rating_count: number;
  comment_count: number;
}

/**
 * Hook to fetch and manage trail statistics
 * @param trailId - The unique identifier of the trail
 * @returns An object containing trail statistics, loading state, and error information
 */
export const useTrailStats = (trailId: string) => {
  return useQuery({
    queryKey: ['trail-stats', trailId],
    queryFn: async () => {
      try {
        // Count likes
        const { count: likeCount, error: likesError } = await supabase
          .from('trail_likes')
          .select('*', { count: 'exact', head: true })
          .eq('trail_id', trailId);
          
        if (likesError) throw likesError;
        
        // Get average rating
        const { data: ratingsData, error: ratingsError } = await supabase
          .from('trail_ratings')
          .select('rating')
          .eq('trail_id', trailId);
          
        if (ratingsError) throw ratingsError;
        
        const ratings = ratingsData || [];
        const totalRating = ratings.reduce((sum, item) => sum + item.rating, 0);
        const avgRating = ratings.length ? totalRating / ratings.length : 0;
        
        // Count comments
        const { count: commentCount, error: commentsError } = await supabase
          .from('trail_comments')
          .select('*', { count: 'exact', head: true })
          .eq('trail_id', trailId);
          
        if (commentsError) throw commentsError;
        
        return {
          visit_count: likeCount || 0,
          completion_count: 0, // We'll implement this feature later
          avg_rating: Number(avgRating.toFixed(1)),
          rating_count: ratings.length,
          comment_count: commentCount || 0
        } as TrailStats;
      } catch (error) {
        console.error('Error fetching trail stats:', error);
        return {
          visit_count: 0,
          completion_count: 0,
          avg_rating: 0,
          rating_count: 0,
          comment_count: 0
        } as TrailStats;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 15, // Keep unused data for 15 minutes
  });
};
