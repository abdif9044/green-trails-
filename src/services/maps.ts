
import { supabase } from '@/integrations/supabase/client';

export interface MapTrail {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  difficulty: 'easy' | 'moderate' | 'hard';
  length: number;
  elevation_gain: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export class MapsService {
  /**
   * Get trails within a specific geographic area
   */
  static async getTrailsInBounds(bounds: MapBounds): Promise<MapTrail[]> {
    try {
      const { data, error } = await supabase
        .from('trails')
        .select('id, name, location, lat, lon, difficulty, length, elevation_gain')
        .gte('lat', bounds.south)
        .lte('lat', bounds.north)
        .gte('lon', bounds.west)
        .lte('lon', bounds.east)
        .limit(100);

      if (error) {
        console.error('Error fetching trails in bounds:', error);
        return this.getMockTrailsInBounds(bounds);
      }

      if (!data || data.length === 0) {
        return this.getMockTrailsInBounds(bounds);
      }

      return data.map(trail => ({
        id: trail.id,
        name: trail.name,
        location: trail.location,
        latitude: trail.lat,
        longitude: trail.lon,
        difficulty: trail.difficulty as 'easy' | 'moderate' | 'hard',
        length: Number(trail.length) || 0,
        elevation_gain: trail.elevation_gain || 0
      }));
    } catch (error) {
      console.error('Error in getTrailsInBounds:', error);
      return this.getMockTrailsInBounds(bounds);
    }
  }

  /**
   * Get mock trails for testing when database is empty
   */
  private static getMockTrailsInBounds(bounds: MapBounds): MapTrail[] {
    const centerLat = (bounds.north + bounds.south) / 2;
    const centerLng = (bounds.east + bounds.west) / 2;

    return [
      {
        id: 'mock-1',
        name: 'Sample Mountain Trail',
        location: 'Local Area',
        latitude: centerLat + 0.01,
        longitude: centerLng + 0.01,
        difficulty: 'moderate' as const,
        length: 5.2,
        elevation_gain: 450
      },
      {
        id: 'mock-2',
        name: 'Easy Valley Walk',
        location: 'Local Park',
        latitude: centerLat - 0.01,
        longitude: centerLng - 0.01,
        difficulty: 'easy' as const,
        length: 2.8,
        elevation_gain: 120
      }
    ];
  }

  /**
   * Search for trails by name or location
   */
  static async searchTrails(query: string, limit: number = 20): Promise<MapTrail[]> {
    try {
      const { data, error } = await supabase
        .from('trails')
        .select('id, name, location, lat, lon, difficulty, length, elevation_gain')
        .or(`name.ilike.%${query}%,location.ilike.%${query}%`)
        .limit(limit);

      if (error) {
        console.error('Error searching trails:', error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data.map(trail => ({
        id: trail.id,
        name: trail.name,
        location: trail.location,
        latitude: trail.lat,
        longitude: trail.lon,
        difficulty: trail.difficulty as 'easy' | 'moderate' | 'hard',
        length: Number(trail.length) || 0,
        elevation_gain: trail.elevation_gain || 0
      }));
    } catch (error) {
      console.error('Error in searchTrails:', error);
      return [];
    }
  }

  /**
   * Get trail details for map popup
   */
  static async getTrailForMap(trailId: string): Promise<MapTrail | null> {
    try {
      const { data, error } = await supabase
        .from('trails')
        .select('id, name, location, lat, lon, difficulty, length, elevation_gain')
        .eq('id', trailId)
        .single();

      if (error || !data) {
        console.error('Error fetching trail for map:', error);
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        location: data.location,
        latitude: data.lat,
        longitude: data.lon,
        difficulty: data.difficulty as 'easy' | 'moderate' | 'hard',
        length: Number(data.length) || 0,
        elevation_gain: data.elevation_gain || 0
      };
    } catch (error) {
      console.error('Error in getTrailForMap:', error);
      return null;
    }
  }
}
