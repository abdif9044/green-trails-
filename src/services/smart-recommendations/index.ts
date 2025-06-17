
import { Trail } from '@/types/trails';
import { UserDataService } from './user-data-service';
import { TrailScoringService } from './trail-scoring';
import { TrailDataService } from './trail-data-service';

export class SmartRecommendationService {
  static async getPersonalizedRecommendations(userId: string, limit: number = 10): Promise<Trail[]> {
    try {
      console.log('Getting personalized recommendations for user:', userId);
      
      // Get user preferences
      const preferences = await UserDataService.getUserPreferences(userId);
      
      // Get user interactions
      const interactions = await UserDataService.getUserInteractions(userId);
      
      // Get liked trails
      const likedTrails = await UserDataService.getLikedTrails(userId);
      
      // Get trails for recommendations
      const trails = await TrailDataService.getTrailsForRecommendations(50);

      if (trails.length === 0) {
        return [];
      }

      // Score trails based on preferences and interactions
      const scoredTrails = trails.map(trail => ({
        ...trail,
        score: TrailScoringService.calculateTrailScore(trail, preferences, interactions, likedTrails)
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

  static async updateUserPreferences(userId: string, preferences: any) {
    return UserDataService.updateUserPreferences(userId, preferences);
  }

  static async recordTrailInteraction(userId: string, trailId: string, interactionType: string) {
    return UserDataService.recordTrailInteraction(userId, trailId, interactionType);
  }
}

// Re-export types and services for backward compatibility
export * from './types';
export { UserDataService } from './user-data-service';
export { TrailScoringService } from './trail-scoring';
export { TrailDataService } from './trail-data-service';
