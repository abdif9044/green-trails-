
import { useQuery } from '@tanstack/react-query';
import { Trail, TrailFilters, TrailDifficulty } from '@/types/trails';
import { useTrailFilters } from './use-trail-filters';
import { supabase } from '@/integrations/supabase/client';

// Helper function to ensure difficulty is a valid TrailDifficulty
const validateDifficulty = (difficulty: string): TrailDifficulty => {
  const validDifficulties: TrailDifficulty[] = ['easy', 'moderate', 'hard', 'expert'];
  return validDifficulties.includes(difficulty as TrailDifficulty) 
    ? difficulty as TrailDifficulty 
    : 'moderate';
};

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
          
        // Apply database-level filters if provided
        if (filters?.country) {
          query = query.eq('country', filters.country);
        }
        
        if (filters?.stateProvince) {
          query = query.eq('state_province', filters.stateProvince);
        }

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
            
          // Use default image url since imageUrl field doesn't exist in the database
          const imageUrl = 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1000&auto=format&fit=crop';
          
          // Format GeoJSON if available
          let geoJson = null;
          try {
            if (trail.geojson) {
              geoJson = trail.geojson;
            }
          } catch (e) {
            console.error('Error parsing GeoJSON:', e);
          }

          return {
            id: trail.id,
            name: trail.name,
            location: trail.location,
            imageUrl: imageUrl,
            difficulty: validateDifficulty(trail.difficulty),
            length: trail.length,
            elevation: trail.elevation,
            tags: tags,
            likes: 0, // We'll implement this later
            coordinates: trail.longitude && trail.latitude ? [trail.longitude, trail.latitude] : undefined,
            strainTags: strainTags,
            isAgeRestricted: trail.is_age_restricted || false,
            description: trail.description,
            country: trail.country,
            state_province: trail.state_province,
            surface: trail.surface,
            trail_type: trail.trail_type,
            geojson: geoJson,
            source: trail.source,
            source_id: trail.source_id
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
          
        // Use default image url since imageUrl field doesn't exist in the database
        const imageUrl = 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1000&auto=format&fit=crop';
        
        // Format GeoJSON if available
        let geoJson = null;
        try {
          if (data.geojson) {
            geoJson = data.geojson;
          }
        } catch (e) {
          console.error('Error parsing GeoJSON:', e);
        }

        // Format trail data
        const trail: Trail = {
          id: data.id,
          name: data.name,
          location: data.location,
          imageUrl: imageUrl,
          difficulty: validateDifficulty(data.difficulty),
          length: data.length,
          elevation: data.elevation,
          tags: tags,
          likes: 0, // We'll implement this later
          coordinates: data.longitude && data.latitude ? [data.longitude, data.latitude] : undefined,
          strainTags: strainTags,
          isAgeRestricted: data.is_age_restricted || false,
          description: data.description,
          country: data.country,
          state_province: data.state_province,
          surface: data.surface,
          trail_type: data.trail_type,
          geojson: geoJson,
          source: data.source,
          source_id: data.source_id
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
