
import { supabase } from '@/integrations/supabase/client';
import { Trail } from '@/types/trails';

interface UserPreferences {
  preferred_difficulty: 'easy' | 'moderate' | 'hard';
  preferred_length_range: [number, number];
  favorite_tags: string[];
  location_preferences: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  time_of_day: 'morning' | 'afternoon' | 'evening';
}

export class SmartRecommendationsService {
  /**
   * Get personalized trail recommendations for a user
   */
  static async getPersonalizedRecommendations(userId: string, limit: number = 10): Promise<Trail[]> {
    try {
      // For now, return basic recommendations since user_preferences table doesn't exist
      const { data: trails, error } = await supabase
        .from('trails')
        .select('*')
        .limit(limit);

      if (error) {
        console.error('Error fetching trail recommendations:', error);
        return [];
      }

      if (!trails) return [];

      // Transform database trails to match Trail interface
      return trails.map(trail => ({
        id: trail.id,
        name: trail.name,
        location: trail.location || 'Unknown Location',
        imageUrl: '/placeholder.svg',
        difficulty: trail.difficulty as 'easy' | 'moderate' | 'hard',
        length: Number(trail.length) || 0,
        elevation: trail.elevation_gain || 0,
        elevation_gain: trail.elevation_gain || 0,
        tags: [],
        likes: Math.floor(Math.random() * 200) + 50,
        coordinates: [trail.lon || 0, trail.lat || 0] as [number, number],
        description: trail.description || 'A beautiful trail waiting to be explored.'
      }));
    } catch (error) {
      console.error('Error in getPersonalizedRecommendations:', error);
      return [];
    }
  }

  /**
   * Get user preferences (mock implementation)
   */
  private static async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      // TODO: Once user_preferences table is created, uncomment this:
      // const { data, error } = await supabase
      //   .from('user_preferences')
      //   .select('*')
      //   .eq('user_id', userId)
      //   .single();
      //
      // if (error || !data) return null;
      // return data as UserPreferences;

      // Return mock preferences for now
      return {
        preferred_difficulty: 'moderate',
        preferred_length_range: [1, 10],
        favorite_tags: ['scenic', 'forest'],
        location_preferences: {
          latitude: 40.0,
          longitude: -100.0,
          radius: 50
        },
        time_of_day: 'morning'
      };
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return null;
    }
  }

  /**
   * Get trail interaction history (mock implementation)
   */
  private static async getTrailInteractions(userId: string): Promise<any[]> {
    try {
      // TODO: Once trail_interactions table is created, implement this
      console.log('Getting trail interactions for user:', userId);
      return [];
    } catch (error) {
      console.error('Error fetching trail interactions:', error);
      return [];
    }
  }

  /**
   * Get user's liked trails (mock implementation)
   */
  private static async getLikedTrails(userId: string): Promise<string[]> {
    try {
      // TODO: Once trail_likes table is created, implement this
      console.log('Getting liked trails for user:', userId);
      return [];
    } catch (error) {
      console.error('Error fetching liked trails:', error);
      return [];
    }
  }

  /**
   * Calculate recommendation score based on user preferences and trail data
   */
  private static calculateRecommendationScore(
    trail: Trail,
    preferences: UserPreferences,
    interactions: any[]
  ): number {
    let score = 0;

    // Difficulty preference matching
    if (trail.difficulty === preferences.preferred_difficulty) {
      score += 0.3;
    }

    // Length preference matching
    const [minLength, maxLength] = preferences.preferred_length_range;
    if (trail.length >= minLength && trail.length <= maxLength) {
      score += 0.2;
    }

    // Tag matching
    const matchingTags = trail.tags.filter(tag => 
      preferences.favorite_tags.includes(tag)
    );
    score += (matchingTags.length / preferences.favorite_tags.length) * 0.3;

    // Location proximity
    if (trail.coordinates && preferences.location_preferences) {
      const distance = this.calculateDistance(
        trail.coordinates[1], trail.coordinates[0],
        preferences.location_preferences.latitude,
        preferences.location_preferences.longitude
      );
      
      if (distance <= preferences.location_preferences.radius) {
        score += 0.2;
      }
    }

    return score;
  }

  /**
   * Calculate distance between two coordinates
   */
  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  /**
   * Get trending trails based on recent activity
   */
  static async getTrendingTrails(limit: number = 10): Promise<Trail[]> {
    try {
      // TODO: Once trail_interactions table exists, implement proper trending logic
      const { data: trails, error } = await supabase
        .from('trails')
        .select('*')
        .limit(limit);

      if (error || !trails) return [];

      return trails.map(trail => ({
        id: trail.id,
        name: trail.name,
        location: trail.location || 'Unknown Location',
        imageUrl: '/placeholder.svg',
        difficulty: trail.difficulty as 'easy' | 'moderate' | 'hard',
        length: Number(trail.length) || 0,
        elevation: trail.elevation_gain || 0,
        elevation_gain: trail.elevation_gain || 0,
        tags: [],
        likes: Math.floor(Math.random() * 200) + 50,
        coordinates: [trail.lon || 0, trail.lat || 0] as [number, number],
        description: trail.description || 'A beautiful trail waiting to be explored.'
      }));
    } catch (error) {
      console.error('Error fetching trending trails:', error);
      return [];
    }
  }
}
