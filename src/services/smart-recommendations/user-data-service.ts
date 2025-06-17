
import { supabase } from '@/integrations/supabase/client';
import { UserPreferences, TrailInteraction } from './types';

export class UserDataService {
  static async getUserPreferences(userId: string): Promise<UserPreferences> {
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

  static async getUserInteractions(userId: string): Promise<TrailInteraction[]> {
    try {
      console.warn('Trail interactions table not available, returning empty');
      return [];
    } catch (error) {
      console.warn('Could not fetch user interactions:', error);
      return [];
    }
  }

  static async getLikedTrails(userId: string): Promise<string[]> {
    try {
      console.warn('Trail likes table not available, returning empty');
      return [];
    } catch (error) {
      console.warn('Could not fetch liked trails:', error);
      return [];
    }
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
