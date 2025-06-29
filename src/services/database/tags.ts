
import { supabase } from '@/integrations/supabase/client';

export interface TrailTag {
  id: string;
  name: string;
  category: 'difficulty' | 'terrain' | 'activity' | 'feature' | 'strain';
  color?: string;
}

export class TrailTagsService {
  /**
   * Get all available trail tags
   */
  static async getAllTags(): Promise<TrailTag[]> {
    try {
      // Since we can't use execute_sql, return mock tags for now
      const mockTags: TrailTag[] = [
        { id: '1', name: 'scenic', category: 'feature', color: '#10b981' },
        { id: '2', name: 'waterfall', category: 'feature', color: '#3b82f6' },
        { id: '3', name: 'mountain-view', category: 'feature', color: '#8b5cf6' },
        { id: '4', name: 'forest', category: 'terrain', color: '#059669' },
        { id: '5', name: 'rocky', category: 'terrain', color: '#6b7280' },
        { id: '6', name: 'loop', category: 'activity', color: '#f59e0b' },
        { id: '7', name: 'out-and-back', category: 'activity', color: '#ef4444' },
      ];
      
      return mockTags;
    } catch (error) {
      console.error('Error fetching trail tags:', error);
      return [];
    }
  }

  /**
   * Create strain tags for age-restricted trails
   */
  static async createStrainTags(trailId: string, strainTags: string[]): Promise<boolean> {
    try {
      console.log(`Creating strain tags for trail ${trailId}:`, strainTags);
      // Mock implementation - would normally insert into database
      return true;
    } catch (error) {
      console.error('Error creating strain tags:', error);
      return false;
    }
  }

  /**
   * Get tags for a specific trail
   */
  static async getTagsForTrail(trailId: string): Promise<TrailTag[]> {
    try {
      // Mock implementation
      const mockTrailTags: TrailTag[] = [
        { id: '1', name: 'scenic', category: 'feature', color: '#10b981' },
        { id: '4', name: 'forest', category: 'terrain', color: '#059669' }
      ];
      
      return mockTrailTags;
    } catch (error) {
      console.error('Error fetching tags for trail:', error);
      return [];
    }
  }
}
