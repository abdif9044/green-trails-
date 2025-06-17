
import { supabase } from '@/integrations/supabase/client';
import { Trail } from '@/types/trails';

interface UserPreferences {
  preferred_difficulty?: string;
  preferred_length_range?: [number, number];
  favorite_tags?: string[];
  location_preferences?: string[];
  time_of_day?: string;
}

interface TrailInteraction {
  trail_id: string;
  interaction_type: 'view' | 'like' | 'comment' | 'hike';
  created_at: string;
}

export class SmartRecommendationService {
  static async getPersonalizedRecommendations(userId: string, limit: number = 10): Promise<Trail[]> {
    try {
      console.log('Getting personalized recommendations for user:', userId);
      
      // Get user preferences (fallback if table doesn't exist)
      const preferences = await this.getUserPreferences(userId);
      
      // Get user interactions (fallback if table doesn't exist)
      const interactions = await this.getUserInteractions(userId);
      
      // Get liked trails (fallback if table doesn't exist)
      const likedTrails = await this.getLikedTrails(userId);
      
      // Get all trails and apply scoring
      const { data: trails, error } = await supabase
        .from('trails')
        .select('*')
        .limit(50);

      if (error) {
        console.error('Error fetching trails for recommendations:', error);
        return [];
      }

      if (!trails || trails.length === 0) {
        return [];
      }

      // Transform database trails to match Trail interface
      const transformedTrails: Trail[] = trails.map(trail => ({
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

      // Score trails based on preferences and interactions
      const scoredTrails = transformedTrails.map(trail => ({
        ...trail,
        score: this.calculateTrailScore(trail, preferences, interactions, likedTrails)
      }));

      // Sort by score and return top results
      return scoredTrails
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      return [];
    }
  }

  private static async getUserPreferences(userId: string): Promise<UserPreferences> {
    try {
      console.warn('User preferences table not available, using defaults');
      return {
        preferred_difficulty: 'moderate',
        preferred_length_range: [2, 8],
        favorite_tags: [],
        location_preferences: [],
        time_of_day: 'morning'
      };
    } catch (error) {
      console.warn('Could not fetch user preferences:', error);
      return {};
    }
  }

  private static async getUserInteractions(userId: string): Promise<TrailInteraction[]> {
    try {
      console.warn('Trail interactions table not available, returning empty');
      return [];
    } catch (error) {
      console.warn('Could not fetch user interactions:', error);
      return [];
    }
  }

  private static async getLikedTrails(userId: string): Promise<string[]> {
    try {
      console.warn('Trail likes table not available, returning empty');
      return [];
    } catch (error) {
      console.warn('Could not fetch liked trails:', error);
      return [];
    }
  }

  private static calculateTrailScore(
    trail: Trail, 
    preferences: UserPreferences, 
    interactions: TrailInteraction[], 
    likedTrails: string[]
  ): number {
    let score = 0;

    // Base score
    score += 1;

    // Difficulty preference
    if (preferences.preferred_difficulty && trail.difficulty === preferences.preferred_difficulty) {
      score += 2;
    }

    // Length preference
    if (preferences.preferred_length_range) {
      const [minLength, maxLength] = preferences.preferred_length_range;
      if (trail.length >= minLength && trail.length <= maxLength) {
        score += 2;
      }
    }

    // Tag preferences
    if (preferences.favorite_tags && preferences.favorite_tags.length > 0) {
      const matchingTags = trail.tags?.filter(tag => 
        preferences.favorite_tags!.includes(tag)
      ).length || 0;
      score += matchingTags * 0.5;
    }

    // Location preferences
    if (preferences.location_preferences && preferences.location_preferences.length > 0) {
      const hasPreferredLocation = preferences.location_preferences.some(location =>
        trail.location.toLowerCase().includes(location.toLowerCase())
      );
      if (hasPreferredLocation) {
        score += 1.5;
      }
    }

    // Interaction history
    const trailInteractions = interactions.filter(i => i.trail_id === trail.id);
    if (trailInteractions.length > 0) {
      // Recent interactions get higher score
      const recentInteractions = trailInteractions.filter(i => 
        new Date(i.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );
      score += recentInteractions.length * 0.3;
    }

    // Liked trails get boost
    if (likedTrails.includes(trail.id)) {
      score += 1;
    }

    // Verified trails get slight boost
    if (trail.is_verified) {
      score += 0.5;
    }

    return score;
  }

  static async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>) {
    try {
      console.warn('User preferences table not available, cannot update preferences');
      return null;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  static async recordTrailInteraction(userId: string, trailId: string, interactionType: string) {
    try {
      console.warn('Trail interactions table not available, cannot record interaction');
      return null;
    } catch (error) {
      console.error('Error recording trail interaction:', error);
      throw error;
    }
  }
}
