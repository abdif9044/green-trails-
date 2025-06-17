
import { Trail } from '@/types/trails';
import { UserPreferences, TrailInteraction } from './types';

export class TrailScoringService {
  static calculateTrailScore(
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
}
