
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Trail {
  id: string;
  name: string;
  location: string;
  difficulty: string;
  distance: number;
  elevation_gain: number;
  description?: string;
  country?: string;
  imageUrl?: string;
  tags?: string[];
  likes?: number;
}

export const useSimilarTrails = (trailId: string, limit = 6) => {
  return useQuery({
    queryKey: ['similar-trails', trailId],
    queryFn: async (): Promise<Trail[]> => {
      try {
        const { data, error } = await supabase
          .from('trails')
          .select('*')
          .neq('id', trailId)
          .limit(limit);

        if (error) {
          console.error('Error fetching similar trails:', error);
          return [];
        }

        // Transform database records to Trail interface
        return (data || []).map(trail => ({
          id: trail.id,
          name: trail.name,
          location: trail.location,
          difficulty: trail.difficulty,
          distance: trail.length || trail.trail_length || 0, // Use available distance field
          elevation_gain: trail.elevation_gain,
          description: trail.description,
          country: trail.country,
          imageUrl: undefined, // No image_url field in current schema
          tags: [], // Default empty array since tags might not be in database
          likes: 0, // Default to 0 since likes might not be in database
        }));
      } catch (error) {
        console.error('Error fetching similar trails:', error);
        return [];
      }
    },
    enabled: !!trailId,
  });
};
