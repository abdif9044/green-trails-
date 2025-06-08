
import { supabase } from '@/integrations/supabase/client';
import { Trail } from '@/types/trails';

interface UserPreferences {
  preferred_difficulty: string[];
  preferred_length_range: [number, number];
  favorite_tags: string[];
  location_preferences: string[];
  time_of_day: string[];
}

interface RecommendationScore {
  trail: Trail;
  score: number;
  reasons: string[];
}

class SmartRecommendationEngine {
  private userBehaviorCache = new Map();
  
  async getPersonalizedRecommendations(
    userId: string, 
    limit: number = 10
  ): Promise<RecommendationScore[]> {
    try {
      // Get user preferences and behavior data
      const [preferences, recentActivity, likedTrails] = await Promise.all([
        this.getUserPreferences(userId),
        this.getRecentActivity(userId),
        this.getLikedTrails(userId)
      ]);

      // Get available trails
      const { data: trails } = await supabase
        .from('trails')
        .select('*')
        .limit(100);

      if (!trails) return [];

      // Score and rank trails
      const scoredTrails = trails
        .filter(trail => !likedTrails.some(liked => liked.id === trail.id))
        .map(trail => this.scoreTrail(trail, preferences, recentActivity))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      return scoredTrails;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [];
    }
  }

  private async getUserPreferences(userId: string): Promise<UserPreferences> {
    const { data } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    return data || {
      preferred_difficulty: ['easy', 'moderate'],
      preferred_length_range: [1, 10],
      favorite_tags: [],
      location_preferences: [],
      time_of_day: ['morning', 'afternoon']
    };
  }

  private async getRecentActivity(userId: string) {
    const { data } = await supabase
      .from('trail_interactions')
      .select('*, trails(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    return data || [];
  }

  private async getLikedTrails(userId: string): Promise<Trail[]> {
    const { data, error } = await supabase
      .from('trail_likes')
      .select(`
        trail_id,
        trails!trail_likes_trail_id_fkey(*)
      `)
      .eq('user_id', userId);

    if (error || !data) {
      console.error('Error fetching liked trails:', error);
      return [];
    }

    // Extract trail data from the response and filter out null values
    return data
      .map(item => item.trails)
      .filter((trail): trail is Trail => {
        return trail !== null && 
               typeof trail === 'object' && 
               'id' in trail && 
               'name' in trail;
      });
  }

  private scoreTrail(
    trail: Trail, 
    preferences: UserPreferences, 
    recentActivity: any[]
  ): RecommendationScore {
    let score = 0;
    const reasons: string[] = [];

    // Difficulty preference matching
    if (preferences.preferred_difficulty.includes(trail.difficulty)) {
      score += 20;
      reasons.push(`Matches your ${trail.difficulty} difficulty preference`);
    }

    // Length preference matching
    const [minLength, maxLength] = preferences.preferred_length_range;
    if (trail.length >= minLength && trail.length <= maxLength) {
      score += 15;
      reasons.push('Perfect length for you');
    }

    // Tag matching
    const matchingTags = trail.tags?.filter(tag => 
      preferences.favorite_tags.includes(tag)
    ).length || 0;
    
    if (matchingTags > 0) {
      score += matchingTags * 10;
      reasons.push(`Matches ${matchingTags} of your favorite activities`);
    }

    // Location preference
    if (preferences.location_preferences.some(loc => 
      trail.location?.toLowerCase().includes(loc.toLowerCase())
    )) {
      score += 25;
      reasons.push('In your preferred area');
    }

    // Similar to recently liked trails
    const similarTrails = recentActivity.filter(activity => 
      activity.action === 'like' && 
      activity.trails?.difficulty === trail.difficulty
    ).length;
    
    if (similarTrails > 0) {
      score += similarTrails * 5;
      reasons.push('Similar to trails you recently liked');
    }

    // Trending boost
    if (trail.likes && trail.likes > 50) {
      score += 10;
      reasons.push('Popular with the community');
    }

    return {
      trail,
      score,
      reasons: reasons.slice(0, 3) // Limit to top 3 reasons
    };
  }

  async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>) {
    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error updating user preferences:', error);
    }
  }
}

export const smartRecommendations = new SmartRecommendationEngine();
export default smartRecommendations;
