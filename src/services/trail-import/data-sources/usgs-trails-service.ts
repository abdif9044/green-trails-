/**
 * USGS National Digital Trails Data Source Service
 * Fetches trail data from USGS authoritative sources
 */

export interface USGSTrail {
  id: string;
  name: string;
  length_km: number;
  difficulty: 'easy' | 'moderate' | 'hard';
  latitude: number;
  longitude: number;
  geojson?: any;
  description?: string;
  elevation_gain?: number;
  location: string;
}

export class USGSTrailsService {
  private static readonly BASE_URL = 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services';
  private static readonly TRAILS_ENDPOINT = '/USA_Recreation_Trails/FeatureServer/0/query';

  /**
   * Fetch trails from USGS ArcGIS REST API
   * Returns GeoJSON format with standardized trail data
   */
  static async fetchTrails(options: {
    bbox?: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
    limit?: number;
    offset?: number;
  } = {}): Promise<USGSTrail[]> {
    const { bbox, limit = 10000, offset = 0 } = options;
    
    try {
      const params = new URLSearchParams({
        where: '1=1',
        outFields: '*',
        outSR: '4326',
        f: 'geojson',
        resultRecordCount: limit.toString(),
        resultOffset: offset.toString(),
      });

      // Add spatial filter if bbox provided
      if (bbox) {
        const [minLng, minLat, maxLng, maxLat] = bbox;
        params.set('geometry', `${minLng},${minLat},${maxLng},${maxLat}`);
        params.set('geometryType', 'esriGeometryEnvelope');
        params.set('spatialRel', 'esriSpatialRelIntersects');
      }

      const url = `${this.BASE_URL}${this.TRAILS_ENDPOINT}?${params.toString()}`;
      console.log(`🔗 Fetching USGS trails: ${url}`);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`USGS API error: ${response.status} ${response.statusText}`);
      }

      const geoData = await response.json();
      
      if (!geoData.features) {
        console.warn('No features found in USGS response');
        return [];
      }

      return geoData.features.map((feature: any) => this.transformFeature(feature));
    } catch (error) {
      console.error('Error fetching USGS trails:', error);
      throw error;
    }
  }

  /**
   * Transform USGS GeoJSON feature to standardized trail format
   */
  private static transformFeature(feature: any): USGSTrail {
    const props = feature.properties || {};
    const geometry = feature.geometry;
    
    // Extract coordinates for point representation
    let latitude = 0, longitude = 0;
    if (geometry && geometry.coordinates) {
      if (geometry.type === 'LineString' && geometry.coordinates.length > 0) {
        // Use first coordinate of line
        [longitude, latitude] = geometry.coordinates[0];
      } else if (geometry.type === 'Point') {
        [longitude, latitude] = geometry.coordinates;
      }
    }

    // Calculate approximate length from geometry
    let length_km = 0;
    if (geometry && geometry.type === 'LineString') {
      length_km = this.calculateLineStringLength(geometry.coordinates);
    }

    // Map difficulty levels
    const difficulty = this.mapDifficulty(props.DIFFICULTY || props.difficulty);

    return {
      id: props.OBJECTID?.toString() || props.FID?.toString() || `usgs-${Date.now()}-${Math.random()}`,
      name: props.TRAIL_NAME || props.NAME || props.trail_name || 'Unnamed Trail',
      length_km: length_km || parseFloat(props.LENGTH_MI) * 1.60934 || 0,
      difficulty,
      latitude,
      longitude,
      geojson: geometry,
      description: props.DESCRIPTION || props.COMMENTS || '',
      elevation_gain: parseInt(props.ELEV_GAIN) || undefined,
      location: props.STATE || props.COUNTY || props.LOCATION || 'Unknown'
    };
  }

  /**
   * Calculate approximate length of LineString in kilometers
   */
  private static calculateLineStringLength(coordinates: number[][]): number {
    if (coordinates.length < 2) return 0;
    
    let totalLength = 0;
    for (let i = 1; i < coordinates.length; i++) {
      const [lon1, lat1] = coordinates[i - 1];
      const [lon2, lat2] = coordinates[i];
      totalLength += this.haversineDistance(lat1, lon1, lat2, lon2);
    }
    return totalLength;
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private static haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Map various difficulty representations to standard format
   */
  private static mapDifficulty(difficulty: string): 'easy' | 'moderate' | 'hard' {
    if (!difficulty) return 'moderate';
    
    const lower = difficulty.toLowerCase();
    if (lower.includes('easy') || lower.includes('beginner') || lower === '1') return 'easy';
    if (lower.includes('hard') || lower.includes('difficult') || lower.includes('expert') || lower === '3') return 'hard';
    return 'moderate';
  }

  /**
   * Fetch trails for entire US in chunks
   */
  static async fetchAllUSTrails(): Promise<USGSTrail[]> {
    const allTrails: USGSTrail[] = [];
    const chunkSize = 1000;
    let offset = 0;
    let hasMore = true;

    console.log('🇺🇸 Starting USGS nationwide trail fetch...');

    while (hasMore && allTrails.length < 100000) { // Safety limit
      try {
        const chunk = await this.fetchTrails({ 
          limit: chunkSize, 
          offset 
        });
        
        if (chunk.length === 0) {
          hasMore = false;
        } else {
          allTrails.push(...chunk);
          offset += chunkSize;
          console.log(`📊 USGS trails fetched: ${allTrails.length}`);
          
          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error(`Error fetching USGS chunk at offset ${offset}:`, error);
        hasMore = false;
      }
    }

    console.log(`✅ USGS fetch complete: ${allTrails.length} trails`);
    return allTrails;
  }
}