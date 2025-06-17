
import { supabase } from '@/integrations/supabase/client';
import { Trail } from '@/types/trails';

export class TrailDataService {
  static async getTrailsForRecommendations(limit: number = 50): Promise<Trail[]> {
    try {
      const { data: trails, error } = await supabase
        .from('trails')
        .select('*')
        .limit(limit);

      if (error) {
        console.error('Error fetching trails for recommendations:', error);
        return [];
      }

      if (!trails || trails.length === 0) {
        return [];
      }

      // Transform database trails to match Trail interface
      return trails.map(trail => ({
        id: trail.id,
        name: trail.name,
        location: trail.location,
        imageUrl: '/placeholder.svg', // Default image since not in database
        difficulty: trail.difficulty as 'easy' | 'moderate' | 'hard' | 'expert',
        length: trail.length || trail.trail_length || 0,
        elevation: trail.elevation || 0,
        elevation_gain: trail.elevation_gain || 0,
        tags: [], // Default empty tags since not in database
        likes: 0, // Default likes since not in database
        coordinates: trail.latitude && trail.longitude ? [trail.longitude, trail.latitude] : undefined,
        description: trail.description,
        country: trail.country,
        state_province: trail.state_province,
        created_at: trail.created_at,
        updated_at: trail.updated_at,
        user_id: trail.user_id,
        is_verified: trail.is_verified,
        is_age_restricted: trail.is_age_restricted,
      }));
    } catch (error) {
      console.error('Error fetching trails for recommendations:', error);
      return [];
    }
  }
}
