
import { supabase } from '@/integrations/supabase/client';
import { Trail } from '@/types/trails';

export class SmartRecommendationService {
  /**
   * Get personalized trail recommendations based on user preferences and history
   */
  static async getPersonalizedRecommendations(userId?: string, limit: number = 10): Promise<Trail[]> {
    try {
      // If no user, return popular trails
      if (!userId) {
        return this.getPopularTrails(limit);
      }

      // For now, return mock recommendations since we don't have ML model yet
      const mockRecommendations: Trail[] = [
        {
          id: 'rec-1',
          name: 'Sunset Ridge Trail',
          location: 'Recommended Park',
          imageUrl: '/placeholder.svg',
          difficulty: 'moderate' as const,
          length: 3.5,
          elevation_gain: 800,
          latitude: 40.7589,
          longitude: -111.8883,
          tags: ['scenic views', 'sunset', 'moderate'],
          likes: 156,
          coordinates: [-111.8883, 40.7589] as [number, number],
          description: 'Perfect trail for sunset viewing with moderate difficulty.'
        }
      ];

      return mockRecommendations;
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      return [];
    }
  }

  /**
   * Get similar trails based on trail characteristics
   */
  static async getSimilarTrails(trailId: string, limit: number = 5): Promise<Trail[]> {
    try {
      // Get the reference trail
      const { data: trail, error } = await supabase
        .from('trails')
        .select('*')
        .eq('id', trailId)
        .single();

      if (error || !trail) {
        console.error('Error fetching reference trail:', error);
        return [];
      }

      // Find similar trails based on difficulty and location
      const { data: similarTrails, error: similarError } = await supabase
        .from('trails')
        .select('*')
        .eq('difficulty', trail.difficulty)
        .neq('id', trailId)
        .limit(limit);

      if (similarError) {
        console.error('Error fetching similar trails:', similarError);
        return [];
      }

      // Transform database trails to Trail interface
      return (similarTrails || []).map(dbTrail => ({
        id: dbTrail.id,
        name: dbTrail.name,
        location: dbTrail.location || 'Unknown Location',
        imageUrl: '/placeholder.svg',
        difficulty: dbTrail.difficulty as 'easy' | 'moderate' | 'hard',
        length: Number(dbTrail.length) || 0,
        elevation_gain: dbTrail.elevation_gain || 0,
        latitude: dbTrail.latitude || dbTrail.lat || 0,
        longitude: dbTrail.longitude || dbTrail.lon || 0,
        tags: [],
        likes: Math.floor(Math.random() * 200) + 50,
        coordinates: [
          dbTrail.longitude || dbTrail.lon || 0,
          dbTrail.latitude || dbTrail.lat || 0
        ] as [number, number],
        description: dbTrail.description || 'A beautiful trail with similar characteristics.'
      }));
    } catch (error) {
      console.error('Error in getSimilarTrails:', error);
      return [];
    }
  }

  /**
   * Get trending trails based on recent activity
   */
  static async getTrendingTrails(limit: number = 10): Promise<Trail[]> {
    try {
      // For now, return mock trending trails since we don't have activity data yet
      const mockTrendingTrails: Trail[] = [
        {
          id: 'trend-1',
          name: 'Viral Vista Trail',
          location: 'Trending National Park',
          imageUrl: '/placeholder.svg',
          difficulty: 'easy' as const,
          length: 2.1,
          elevation_gain: 300,
          latitude: 39.7392,
          longitude: -104.9903,
          tags: ['trending', 'easy', 'family'],
          likes: 489,
          coordinates: [-104.9903, 39.7392] as [number, number],
          description: 'Currently trending trail perfect for families.'
        }
      ];

      return mockTrendingTrails.slice(0, limit);
    } catch (error) {
      console.error('Error getting trending trails:', error);
      return [];
    }
  }

  /**
   * Get popular trails as fallback
   */
  private static async getPopularTrails(limit: number): Promise<Trail[]> {
    try {
      const { data: trails, error } = await supabase
        .from('trails')
        .select('*')
        .limit(limit)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching popular trails:', error);
        return [];
      }

      return (trails || []).map(dbTrail => ({
        id: dbTrail.id,
        name: dbTrail.name,
        location: dbTrail.location || 'Unknown Location',
        imageUrl: '/placeholder.svg',
        difficulty: dbTrail.difficulty as 'easy' | 'moderate' | 'hard',
        length: Number(dbTrail.length) || 0,
        elevation_gain: dbTrail.elevation_gain || 0,
        latitude: dbTrail.latitude || dbTrail.lat || 0,
        longitude: dbTrail.longitude || dbTrail.lon || 0,
        tags: [],
        likes: Math.floor(Math.random() * 200) + 50,
        coordinates: [
          dbTrail.longitude || dbTrail.lon || 0,
          dbTrail.latitude || dbTrail.lat || 0
        ] as [number, number],
        description: dbTrail.description || 'A popular trail worth exploring.'
      }));
    } catch (error) {
      console.error('Error fetching popular trails:', error);
      return [];
    }
  }
}