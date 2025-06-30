/**
 * National Park Service (NPS) Trails Data Source Service
 * Fetches trail data from NPS authoritative sources via ArcGIS Hub
 */

export interface NPSTrail {
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
  park_name?: string;
  trail_type?: string;
}

export class NPSTrailsService {
  private static readonly BASE_URL = 'https://services1.arcgis.com/fBc8EJBxQRMcHlei/arcgis/rest/services';
  private static readonly TRAILS_ENDPOINT = '/NPS_-_Trails/FeatureServer/0/query';

  /**
   * Fetch trails from NPS ArcGIS REST API
   */
  static async fetchTrails(options: {
    bbox?: [number, number, number, number];
    limit?: number;
    offset?: number;
    parkCode?: string;
  } = {}): Promise<NPSTrail[]> {
    const { bbox, limit = 10000, offset = 0, parkCode } = options;
    
    try {
      let whereClause = '1=1';
      if (parkCode) {
        whereClause = `UNITCODE = '${parkCode}'`;
      }

      const params = new URLSearchParams({
        where: whereClause,
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
      console.log(`🏞️ Fetching NPS trails: ${url}`);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`NPS API error: ${response.status} ${response.statusText}`);
      }

      const geoData = await response.json();
      
      if (!geoData.features) {
        console.warn('No features found in NPS response');
        return [];
      }

      return geoData.features.map((feature: any) => this.transformFeature(feature));
    } catch (error) {
      console.error('Error fetching NPS trails:', error);
      throw error;
    }
  }

  /**
   * Transform NPS GeoJSON feature to standardized trail format
   */
  private static transformFeature(feature: any): NPSTrail {
    const props = feature.properties || {};
    const geometry = feature.geometry;
    
    // Extract coordinates
    let latitude = 0, longitude = 0;
    if (geometry && geometry.coordinates) {
      if (geometry.type === 'LineString' && geometry.coordinates.length > 0) {
        [longitude, latitude] = geometry.coordinates[0];
      } else if (geometry.type === 'Point') {
        [longitude, latitude] = geometry.coordinates;
      }
    }

    // Calculate length
    let length_km = 0;
    if (geometry && geometry.type === 'LineString') {
      length_km = this.calculateLineStringLength(geometry.coordinates);
    }

    // Map difficulty
    const difficulty = this.mapDifficulty(props.TRLCLASS || props.DIFFICULTY);

    return {
      id: props.OBJECTID?.toString() || props.TRLFEATID?.toString() || `nps-${Date.now()}-${Math.random()}`,
      name: props.TRLNAME || props.NAME || 'Unnamed National Park Trail',
      length_km: length_km || parseFloat(props.TRLLENGTH) || 0,
      difficulty,
      latitude,
      longitude,
      geojson: geometry,
      description: props.TRLDESCR || props.DESCRIPTION || '',
      elevation_gain: parseInt(props.ELEVGAIN) || undefined,
      location: props.UNITNAME || props.STATE || 'National Park',
      park_name: props.UNITNAME || props.PARKNAME,
      trail_type: props.TRLTYPE || props.TRLUSE
    };
  }

  /**
   * Calculate LineString length in kilometers
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
   * Haversine distance calculation
   */
  private static haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Map NPS trail classification to difficulty
   */
  private static mapDifficulty(classification: string): 'easy' | 'moderate' | 'hard' {
    if (!classification) return 'moderate';
    
    const lower = classification.toLowerCase();
    if (lower.includes('1') || lower.includes('easy') || lower.includes('accessible')) return 'easy';
    if (lower.includes('3') || lower.includes('4') || lower.includes('5') || lower.includes('difficult') || lower.includes('strenuous')) return 'hard';
    return 'moderate';
  }

  /**
   * Fetch all NPS trails across all national parks
   */
  static async fetchAllNPSTrails(): Promise<NPSTrail[]> {
    const allTrails: NPSTrail[] = [];
    const chunkSize = 1000;
    let offset = 0;
    let hasMore = true;

    console.log('🏞️ Starting NPS nationwide trail fetch...');

    while (hasMore && allTrails.length < 50000) { // NPS has fewer trails than USGS
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
          console.log(`📊 NPS trails fetched: ${allTrails.length}`);
          
          // Rate limiting for NPS API
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } catch (error) {
        console.error(`Error fetching NPS chunk at offset ${offset}:`, error);
        hasMore = false;
      }
    }

    console.log(`✅ NPS fetch complete: ${allTrails.length} trails`);
    return allTrails;
  }

  /**
   * Get list of major national parks for targeted fetching
   */
  static getMajorParks(): string[] {
    return [
      'YELL', // Yellowstone
      'GRCA', // Grand Canyon
      'YOSE', // Yosemite
      'ZION', // Zion
      'ROMO', // Rocky Mountain
      'GRSM', // Great Smoky Mountains
      'ACAD', // Acadia
      'OLYM', // Olympic
      'GLAC', // Glacier
      'DENA', // Denali
    ];
  }
}