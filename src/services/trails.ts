import { supabase } from '@/integrations/supabase/client';
import { Trail, DatabaseTrail, TrailFilters } from '@/types/trails';
import { useQuery } from '@tanstack/react-query';

export class TrailService {
  /**
   * Convert database trail to frontend trail interface
   */
  private static transformDatabaseTrail(dbTrail: DatabaseTrail): Trail {
    return {
      id: dbTrail.id,
      name: dbTrail.name,
      location: dbTrail.location || 'Unknown Location',
      description: dbTrail.description || '',
      difficulty: dbTrail.difficulty,
      length: Number(dbTrail.length) || 0,
      elevation_gain: dbTrail.elevation_gain || 0,
      latitude: dbTrail.latitude || dbTrail.lat || 0,
      longitude: dbTrail.longitude || dbTrail.lon || 0,
      coordinates: [dbTrail.longitude || dbTrail.lon || 0, dbTrail.latitude || dbTrail.lat || 0],
      tags: [],
      likes: Math.floor(Math.random() * 200) + 50, // TODO: Replace with real likes count
      imageUrl: '/placeholder.svg',
      category: dbTrail.category,
      country: dbTrail.country,
      region: dbTrail.region,
      is_age_restricted: dbTrail.is_age_restricted,
      is_verified: dbTrail.is_verified,
      created_at: dbTrail.created_at,
      updated_at: dbTrail.updated_at,
      // Add compatibility properties
      elevation: dbTrail.elevation_gain || 0,
      geojson: dbTrail.geojson,
      state_province: dbTrail.region
    };
  }

  /**
   * Get trails within a geographic radius
   */
  static async getTrailsInRadius(
    latitude: number,
    longitude: number,
    radiusKm: number = 50
  ): Promise<Trail[]> {
    try {
      // For now, use simple distance calculation since trails_within_radius function may not exist
      const { data, error } = await supabase
        .from('trails')
        .select('*')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .limit(100);

      if (error) {
        console.error('Error fetching trails in radius:', error);
        return [];
      }

      if (!data) return [];

      // Filter by distance calculation (approximate)
      const filteredTrails = data.filter((trail: any) => {
        const lat = trail.latitude || trail.lat;
        const lng = trail.longitude || trail.lon;
        if (!lat || !lng) return false;
        
        const distance = this.calculateDistance(latitude, longitude, lat, lng);
        return distance <= radiusKm;
      });

      return filteredTrails.map(trail => this.transformDatabaseTrail(trail as DatabaseTrail));
    } catch (error) {
      console.error('Error in getTrailsInRadius:', error);
      return [];
    }
  }

  /**
   * Search trails with filters
   */
  static async searchTrails(filters: TrailFilters, limit: number = 20): Promise<Trail[]> {
    try {
      let query = supabase
        .from('trails')
        .select('*')
        .limit(limit);

      // Apply search query filter
      if (filters.searchQuery) {
        query = query.or(`name.ilike.%${filters.searchQuery}%,location.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
      }

      // Apply difficulty filter
      if (filters.difficulty && filters.difficulty !== '') {
        query = query.eq('difficulty', filters.difficulty);
      }

      // Apply length range filter
      if (filters.lengthRange) {
        const [minLength, maxLength] = filters.lengthRange;
        query = query.gte('length', minLength).lte('length', maxLength);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error searching trails:', error);
        return [];
      }

      if (!data) return [];

      return data.map(trail => this.transformDatabaseTrail(trail as DatabaseTrail));
    } catch (error) {
      console.error('Error in searchTrails:', error);
      return [];
    }
  }

  /**
   * Get trail by ID
   */
  static async getTrailById(id: string): Promise<Trail | null> {
    try {
      const { data, error } = await supabase
        .from('trails')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error('Error fetching trail by ID:', error);
        return null;
      }

      return this.transformDatabaseTrail(data as DatabaseTrail);
    } catch (error) {
      console.error('Error in getTrailById:', error);
      return null;
    }
  }

  /**
   * Get nearby trails using simple distance calculation
   */
  static async getNearbyTrails(
    latitude: number,
    longitude: number,
    limit: number = 10
  ): Promise<Trail[]> {
    try {
      const { data, error } = await supabase
        .from('trails')
        .select('*')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .limit(100); // Get more to filter by distance

      if (error) {
        console.error('Error fetching nearby trails:', error);
        return [];
      }

      if (!data) return [];

      // Calculate distances and sort by proximity
      const trailsWithDistance = data
        .map((trail: any) => {
          const lat = trail.latitude || trail.lat;
          const lng = trail.longitude || trail.lon;
          if (!lat || !lng) return null;
          
          return {
            ...trail,
            distance: this.calculateDistance(latitude, longitude, lat, lng)
          };
        })
        .filter(Boolean)
        .sort((a, b) => (a?.distance || 0) - (b?.distance || 0))
        .slice(0, limit);

      return trailsWithDistance.map(trail => this.transformDatabaseTrail(trail as DatabaseTrail));
    } catch (error) {
      console.error('Error in getNearbyTrails:', error);
      return [];
    }
  }

  /**
   * Calculate distance between two coordinates in kilometers
   */
  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
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
   * Get popular trails
   */
  static async getPopularTrails(limit: number = 10): Promise<Trail[]> {
    try {
      const { data, error } = await supabase
        .from('trails')
        .select('*')
        .limit(limit)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching popular trails:', error);
        return [];
      }

      if (!data) return [];

      return data.map(trail => this.transformDatabaseTrail(trail as DatabaseTrail));
    } catch (error) {
      console.error('Error in getPopularTrails:', error);
      return [];
    }
  }
}

// Export the hook that components are trying to import
export const useTrails = (filters?: TrailFilters) => {
  return useQuery({
    queryKey: ['trails', filters],
    queryFn: () => TrailService.searchTrails(filters || {}),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
