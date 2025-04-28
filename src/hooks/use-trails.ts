
import { useQuery } from '@tanstack/react-query';
import { Trail, TrailFilters } from '@/types/trails';
import { useTrailFilters } from './use-trail-filters';
import { supabase } from '@/integrations/supabase/client';

export const useTrails = (filters?: TrailFilters) => {
  const { data: trails = [], ...rest } = useQuery({
    queryKey: ['trails', filters],
    queryFn: async () => {
      try {
        let query = supabase
          .from('trails')
          .select(`
            *,
            trail_tags (
              id,
              tag,
              is_strain_tag
            )
          `);

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching trails:', error);
          throw error;
        }

        // Transform the data to match our Trail type
        const formattedTrails: Trail[] = data.map(trail => {
          // Extract regular tags and strain tags
          const allTags = trail.trail_tags || [];
          const tags = allTags
            .filter(tag => !tag.is_strain_tag)
            .map(tag => tag.tag);
          
          const strainTags = allTags
            .filter(tag => tag.is_strain_tag)
            .map(tag => tag.tag);

          return {
            id: trail.id,
            name: trail.name,
            location: trail.location,
            imageUrl: trail.image_url || 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1000&auto=format&fit=crop',
            difficulty: trail.difficulty,
            length: trail.length,
            elevation: trail.elevation,
            tags: tags,
            likes: 0, // We'll implement this later
            coordinates: trail.longitude && trail.latitude ? [trail.longitude, trail.latitude] : undefined,
            strainTags: strainTags,
            isAgeRestricted: trail.is_age_restricted || false,
            description: trail.description
          };
        });

        return formattedTrails;
      } catch (error) {
        console.error('Error in useTrails:', error);
        return [];
      }
    }
  });

  const filteredTrails = useTrailFilters(trails, filters);
  return { data: filteredTrails, ...rest };
};

export const useTrail = (trailId: string | undefined) => {
  return useQuery({
    queryKey: ['trail', trailId],
    queryFn: async () => {
      if (!trailId) return null;
      
      try {
        const { data, error } = await supabase
          .from('trails')
          .select(`
            *,
            trail_tags (
              id,
              tag,
              is_strain_tag
            )
          `)
          .eq('id', trailId)
          .single();

        if (error) {
          console.error('Error fetching trail:', error);
          throw error;
        }

        if (!data) {
          return null;
        }

        // Extract regular tags and strain tags
        const allTags = data.trail_tags || [];
        const tags = allTags
          .filter(tag => !tag.is_strain_tag)
          .map(tag => tag.tag);
        
        const strainTags = allTags
          .filter(tag => tag.is_strain_tag)
          .map(tag => tag.tag);

        // Format trail data
        const trail: Trail = {
          id: data.id,
          name: data.name,
          location: data.location,
          imageUrl: data.image_url || 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1000&auto=format&fit=crop',
          difficulty: data.difficulty,
          length: data.length,
          elevation: data.elevation,
          tags: tags,
          likes: 0, // We'll implement this later
          coordinates: data.longitude && data.latitude ? [data.longitude, data.latitude] : undefined,
          strainTags: strainTags,
          isAgeRestricted: data.is_age_restricted || false,
          description: data.description
        };

        return trail;
      } catch (error) {
        console.error('Error in useTrail:', error);
        return null;
      }
    },
    enabled: !!trailId,
  });
};

// Re-export types from the types file for components that import from this file
export type { Trail, TrailFilters, TrailDifficulty } from '@/types/trails';
