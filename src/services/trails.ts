
import { supabase } from '@/integrations/supabase/client';
import { Trail, DatabaseTrail, TrailFilters } from '@/types/trails';
import { useQuery } from '@tanstack/react-query';

export class TrailService {
  /**
   * Convert database trail to frontend trail interface
   */
  private static transformDatabaseTrail(dbTrail: any): Trail {
    return {
      id: dbTrail.id,
      name: dbTrail.name || 'Unnamed Trail',
      location: dbTrail.location || 'Unknown Location',
      description: dbTrail.description || '',
      difficulty: (dbTrail.difficulty || 'moderate') as 'easy' | 'moderate' | 'hard' | 'expert',
      length: Number(dbTrail.length) || 0,
      elevation_gain: dbTrail.elevation_gain || 0,
      latitude: dbTrail.latitude || dbTrail.lat || 0,
      longitude: dbTrail.longitude || dbTrail.lon || 0,
      coordinates: [dbTrail.longitude || dbTrail.lon || 0, dbTrail.latitude || dbTrail.lat || 0],
      tags: dbTrail.tags || [],
      likes: Math.floor(Math.random() * 200) + 50, // TODO: Replace with real likes count
      imageUrl: dbTrail.photos?.[0] || '/placeholder.svg',
      category: dbTrail.category as 'hiking' | 'biking' | 'offroad' || 'hiking',
      country: dbTrail.country || '',
      region: dbTrail.region || '',
      is_age_restricted: dbTrail.is_age_restricted || false,
      is_verified: dbTrail.is_verified || false,
      created_at: dbTrail.created_at,
      updated_at: dbTrail.updated_at,
      elevation: dbTrail.elevation_gain || 0,
      geojson: dbTrail.geojson,
      state_province: dbTrail.region,
      photos: dbTrail.photos || [],
      features: dbTrail.features || [],
      surface_type: dbTrail.surface_type,
      permit_required: dbTrail.permit_required || false,
      dogs_allowed: dbTrail.dogs_allowed || true,
      camping_available: dbTrail.camping_available || false,
      data_quality_score: dbTrail.data_quality_score || 1.0
    };
  }

  /**
   * Search trails with filters using the new database function
   */
  static async searchTrails(filters: TrailFilters = {}, limit: number = 50, offset: number = 0): Promise<{ data: Trail[], count: number }> {
    try {
      console.log('TrailService.searchTrails called with filters:', filters);
      
      // Use the new search_trails database function
      const { data, error } = await supabase.rpc('search_trails', {
        search_query: filters.searchQuery || null,
        filter_difficulty: filters.difficulty || null,
        filter_length_min: filters.lengthRange?.[0] || null,
        filter_length_max: filters.lengthRange?.[1] || null,
        filter_tags: filters.tags || null,
        filter_features: null, // Can be extended later
        sort_by: 'name',
        limit_count: limit,
        offset_count: offset
      });

      if (error) {
        console.error('Error in TrailService.searchTrails:', error);
        throw error;
      }

      if (!data) {
        console.log('No data returned from search_trails function');
        return { data: [], count: 0 };
      }

      console.log(`Found ${data.length} trails from database`);
      const transformedTrails = data.map(trail => this.transformDatabaseTrail(trail));
      
      return {
        data: transformedTrails,
        count: data.length
      };
    } catch (error) {
      console.error('Error in searchTrails:', error);
      return { data: [], count: 0 };
    }
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
      const { data, error } = await supabase.rpc('trails_within_radius', {
        center_lat: latitude,
        center_lng: longitude,
        radius_km: radiusKm
      });

      if (error) {
        console.error('Error fetching trails in radius:', error);
        return [];
      }

      if (!data) return [];

      return data.map(trail => this.transformDatabaseTrail(trail));
    } catch (error) {
      console.error('Error in getTrailsInRadius:', error);
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
        .eq('is_active', true)
        .eq('status', 'approved')
        .single();

      if (error || !data) {
        console.error('Error fetching trail by ID:', error);
        return null;
      }

      return this.transformDatabaseTrail(data);
    } catch (error) {
      console.error('Error in getTrailById:', error);
      return null;
    }
  }

  /**
   * Get nearby trails using database function
   */
  static async getNearbyTrails(
    latitude: number,
    longitude: number,
    limit: number = 10
  ): Promise<Trail[]> {
    return this.getTrailsInRadius(latitude, longitude, 25); // 25km radius for nearby
  }

  /**
   * Get popular trails (most recently added)
   */
  static async getPopularTrails(limit: number = 10): Promise<Trail[]> {
    try {
      const { data, error } = await supabase
        .from('trails')
        .select('*')
        .eq('is_active', true)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching popular trails:', error);
        return [];
      }

      if (!data) return [];

      return data.map(trail => this.transformDatabaseTrail(trail));
    } catch (error) {
      console.error('Error in getPopularTrails:', error);
      return [];
    }
  }

  /**
   * Get featured trails (high quality trails)
   */
  static async getFeaturedTrails(limit: number = 10): Promise<Trail[]> {
    try {
      const { data, error } = await supabase
        .from('trails')
        .select('*')
        .eq('is_active', true)
        .eq('status', 'approved')
        .not('data_quality_score', 'is', null)
        .order('data_quality_score', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching featured trails:', error);
        return [];
      }

      if (!data) return [];

      return data.map(trail => this.transformDatabaseTrail(trail));
    } catch (error) {
      console.error('Error in getFeaturedTrails:', error);
      return [];
    }
  }

  /**
   * Get trail recommendations using database function
   */
  static async getTrailRecommendations(
    userDifficulty?: string,
    userLengthPreference?: number,
    userLat?: number,
    userLng?: number,
    limit: number = 10
  ): Promise<Trail[]> {
    try {
      const { data, error } = await supabase.rpc('get_trail_recommendations', {
        user_difficulty: (userDifficulty as 'easy' | 'moderate' | 'hard') || null,
        user_length_preference: userLengthPreference || null,
        user_location_lat: userLat || null,
        user_location_lng: userLng || null,
        recommendation_limit: limit
      });

      if (error) {
        console.error('Error fetching trail recommendations:', error);
        return [];
      }

      if (!data) return [];

      return data.map(trail => this.transformDatabaseTrail(trail));
    } catch (error) {
      console.error('Error in getTrailRecommendations:', error);
      return [];
    }
  }

  /**
   * Get trail statistics using database function
   */
  static async getTrailStatistics() {
    try {
      const { data, error } = await supabase.rpc('get_trail_statistics');

      if (error) {
        console.error('Error fetching trail statistics:', error);
        throw error;
      }

      return data?.[0] || null;
    } catch (error) {
      console.error('Error in getTrailStatistics:', error);
      throw error;
    }
  }
}

// Export hooks that components are using
export const useTrails = (filters?: TrailFilters) => {
  return useQuery({
    queryKey: ['trails', filters],
    queryFn: async () => {
      const result = await TrailService.searchTrails(filters || {});
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTrail = (id: string) => {
  return useQuery({
    queryKey: ['trail', id],
    queryFn: () => TrailService.getTrailById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTrailsSearch = (params: { filters?: TrailFilters; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['trails-search', params],
    queryFn: async () => {
      const offset = ((params.page || 1) - 1) * (params.limit || 20);
      return await TrailService.searchTrails(params.filters || {}, params.limit || 20, offset);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFeaturedTrails = (limit: number = 10) => {
  return useQuery({
    queryKey: ['featured-trails', limit],
    queryFn: () => TrailService.getFeaturedTrails(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useNearbyTrails = (latitude?: number, longitude?: number, limit: number = 10) => {
  return useQuery({
    queryKey: ['nearby-trails', latitude, longitude, limit],
    queryFn: () => {
      if (!latitude || !longitude) return [];
      return TrailService.getNearbyTrails(latitude, longitude, limit);
    },
    enabled: !!latitude && !!longitude,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTrailStatistics = () => {
  return useQuery({
    queryKey: ['trail-statistics'],
    queryFn: () => TrailService.getTrailStatistics(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};
