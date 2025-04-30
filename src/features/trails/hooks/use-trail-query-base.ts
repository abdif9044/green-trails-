
import { supabase } from '@/integrations/supabase/client';
import { TrailDifficulty } from '@/types/trails';

// Helper function to ensure difficulty is a valid TrailDifficulty
export const validateDifficulty = (difficulty: string): TrailDifficulty => {
  const validDifficulties: TrailDifficulty[] = ['easy', 'moderate', 'hard', 'expert'];
  return validDifficulties.includes(difficulty as TrailDifficulty) 
    ? difficulty as TrailDifficulty 
    : 'moderate';
};

// Create base trail object from Supabase data
export const formatTrailData = (trail: any) => {
  // Extract regular tags and strain tags
  const allTags = trail.trail_tags || [];
  const tags = allTags
    .filter((tag: any) => !tag.is_strain_tag)
    .map((tag: any) => tag.tag);
  
  const strainTags = allTags
    .filter((tag: any) => tag.is_strain_tag)
    .map((tag: any) => tag.tag);
    
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
    likes: 0, // We'll implement this later with proper count
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
};

// Base query function for trails with filters
export const queryTrailsWithFilters = async (filters: any = {}) => {
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

  return query;
};
