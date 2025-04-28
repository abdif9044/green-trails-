
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Trail } from '@/types/trails';

/**
 * Hook to fetch similar trails based on a given trail ID
 * @param trailId - The unique identifier of the reference trail
 * @returns An object containing similar trails, loading state, and error information
 */
export const useSimilarTrails = (trailId: string) => {
  return useQuery({
    queryKey: ['similar-trails', trailId],
    queryFn: async () => {
      try {
        // Get the tags from the current trail
        const { data: trailTags, error: tagsError } = await supabase
          .from('trail_tags')
          .select('tag')
          .eq('trail_id', trailId)
          .eq('is_strain_tag', false);

        if (tagsError) throw tagsError;
        
        const tags = trailTags.map(t => t.tag);
        
        // Find trails with similar tags
        const { data: similarTrailsData, error: similarError } = await supabase
          .from('trails')
          .select(`
            *,
            trail_tags!inner (
              tag,
              is_strain_tag
            )
          `)
          .neq('id', trailId)
          .eq('trail_tags.is_strain_tag', false)
          .in('trail_tags.tag', tags)
          .limit(3);

        if (similarError) throw similarError;
        
        // De-duplicate trails
        const uniqueTrails = Array.from(
          new Map(similarTrailsData.map(trail => [trail.id, trail])).values()
        );
        
        // Transform to Trail objects
        return uniqueTrails.map(trail => {
          return {
            id: trail.id,
            name: trail.name,
            location: trail.location,
            imageUrl: trail.image_url || 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1000&auto=format&fit=crop',
            difficulty: trail.difficulty,
            length: trail.length,
            elevation: trail.elevation,
            tags: [],
            likes: 0,
            coordinates: trail.longitude && trail.latitude ? [trail.longitude, trail.latitude] : undefined,
            strainTags: [],
            isAgeRestricted: trail.is_age_restricted || false
          } as Trail;
        });
      } catch (error) {
        console.error('Error fetching similar trails:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
  });
};
