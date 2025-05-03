
import { supabase } from '@/integrations/supabase/client';
import { TrailDifficulty, TrailFilters, StrainTag } from '@/types/trails';

// Helper function to ensure difficulty is a valid TrailDifficulty
export const validateDifficulty = (difficulty: string): TrailDifficulty => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'easy';
    case 'moderate':
      return 'moderate';
    case 'hard':
      return 'hard';
    case 'expert':
      return 'expert';
    default:
      return 'moderate'; // Default fallback
  }
};

// Create base trail object from Supabase data
export const formatTrailData = (trail: any) => {
  // Extract regular tags and strain tags
  const tags: string[] = [];
  const strainTags: StrainTag[] = [];
  
  // Handle trail_tags relationship if available
  if (trail.trail_tags) {
    trail.trail_tags.forEach((tagData: any) => {
      if (tagData.tag) {
        if (tagData.is_strain_tag) {
          strainTags.push({
            name: tagData.tag.name,
            type: tagData.tag.details?.type || 'hybrid',
            effects: tagData.tag.details?.effects || [],
            description: tagData.tag.details?.description
          });
        } else {
          tags.push(tagData.tag.name);
        }
      }
    });
  }
  
  // Default image selection based on difficulty and type
  let imageUrl = 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1000&auto=format&fit=crop';
  
  // Vary images based on trail characteristics for more variety
  if (trail.difficulty === 'easy') {
    imageUrl = 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=1000&auto=format&fit=crop';
  } else if (trail.difficulty === 'hard') {
    imageUrl = 'https://images.unsplash.com/photo-1454982523318-4b6396f39d3a?q=80&w=1000&auto=format&fit=crop';
  } else if (trail.trail_type === 'loop') {
    imageUrl = 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1000&auto=format&fit=crop';
  }
  
  // Format GeoJSON if available
  let geoJson = null;
  try {
    if (trail.geojson) {
      geoJson = trail.geojson;
    }
  } catch (e) {
    console.error('Error parsing GeoJSON:', e);
  }

  // Ensure coordinates are properly formatted as [number, number] tuple
  const coordinates: [number, number] | undefined = 
    trail.longitude !== null && trail.latitude !== null 
      ? [Number(trail.longitude), Number(trail.latitude)] 
      : undefined;

  return {
    id: trail.id,
    name: trail.name || 'Unnamed Trail',
    location: trail.location || 'Unknown Location',
    imageUrl: imageUrl,
    difficulty: validateDifficulty(trail.difficulty || 'moderate'),
    length: trail.length || 0,
    elevation: trail.elevation || 0,
    elevation_gain: trail.elevation_gain || 0,
    tags: tags,
    likes: trail.likes_count || 0,
    coordinates: coordinates,
    strainTags: strainTags,
    isAgeRestricted: trail.is_age_restricted || false,
    description: trail.description || '',
    country: trail.country,
    state_province: trail.state_province,
    surface: trail.surface,
    trail_type: trail.trail_type,
    geojson: geoJson,
    source: trail.source,
    source_id: trail.source_id
  };
};

// Base query function for trails with filters
export const queryTrailsWithFilters = (filters: TrailFilters = {}) => {
  try {
    let query = supabase
      .from('trails')
      .select(`
        *,
        trail_tags (
          is_strain_tag,
          tag:tag_id (
            name,
            details,
            tag_type
          )
        ),
        trail_likes (
          id
        )
      `);
      
    // Apply database-level filters
    if (filters?.country) {
      query = query.eq('country', filters.country);
    }
    
    if (filters?.stateProvince) {
      query = query.eq('state_province', filters.stateProvince);
    }
    
    if (filters?.difficulty) {
      query = query.eq('difficulty', filters.difficulty);
    }
    
    if (filters?.searchQuery) {
      query = query.ilike('name', `%${filters.searchQuery}%`);
    }
    
    if (filters?.lengthRange) {
      const [min, max] = filters.lengthRange;
      query = query.gte('length', min).lte('length', max);
    }
    
    // Only show age-restricted content if explicitly requested
    if (!filters?.showAgeRestricted) {
      query = query.eq('is_age_restricted', false);
    }
    
    // Add pagination and limits for performance
    query = query.order('name').limit(100);
    
    return query;
  } catch (error) {
    console.error('Error setting up trail query:', error);
    throw error;
  }
};
