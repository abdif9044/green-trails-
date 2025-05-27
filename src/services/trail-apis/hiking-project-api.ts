
import { HikingProjectTrail } from '@/utils/trail-data-normalizer';

export class HikingProjectAPI {
  private baseUrl = 'https://www.hikingproject.com/data';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getTrails(params: {
    lat?: number;
    lon?: number;
    maxDistance?: number;
    maxResults?: number;
    sort?: 'quality' | 'distance';
    minLength?: number;
    minStars?: number;
  } = {}): Promise<{ trails: HikingProjectTrail[]; success: number }> {
    const queryParams = new URLSearchParams({
      key: this.apiKey,
      maxResults: (params.maxResults || 500).toString(),
      sort: params.sort || 'quality',
      ...(params.lat && { lat: params.lat.toString() }),
      ...(params.lon && { lon: params.lon.toString() }),
      ...(params.maxDistance && { maxDistance: params.maxDistance.toString() }),
      ...(params.minLength && { minLength: params.minLength.toString() }),
      ...(params.minStars && { minStars: params.minStars.toString() })
    });

    const url = `${this.baseUrl}/get-trails?${queryParams}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching from Hiking Project API:', error);
      throw error;
    }
  }

  async getTrailsByIds(trailIds: number[]): Promise<{ trails: HikingProjectTrail[]; success: number }> {
    const queryParams = new URLSearchParams({
      key: this.apiKey,
      ids: trailIds.join(',')
    });

    const url = `${this.baseUrl}/get-trails-by-id?${queryParams}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching trails by IDs from Hiking Project API:', error);
      throw error;
    }
  }

  // Get all trails in batches across different regions
  async getAllTrailsInBatches(batchSize: number = 500): Promise<HikingProjectTrail[]> {
    const allTrails: HikingProjectTrail[] = [];
    
    // Major US hiking regions with coordinates
    const regions = [
      { lat: 40.7128, lon: -74.0060, name: 'Northeast' }, // NYC area
      { lat: 39.7392, lon: -104.9903, name: 'Colorado' }, // Denver area
      { lat: 37.7749, lon: -122.4194, name: 'California' }, // SF area
      { lat: 47.6062, lon: -122.3321, name: 'Pacific Northwest' }, // Seattle area
      { lat: 35.2271, lon: -80.8431, name: 'Southeast' }, // Charlotte area
      { lat: 30.2672, lon: -97.7431, name: 'Texas' }, // Austin area
      { lat: 33.4484, lon: -112.0740, name: 'Southwest' }, // Phoenix area
      { lat: 41.2524, lon: -95.9980, name: 'Midwest' }, // Omaha area
      { lat: 64.2008, lon: -149.4937, name: 'Alaska' }, // Fairbanks area
      { lat: 21.3099, lon: -157.8581, name: 'Hawaii' } // Honolulu area
    ];

    for (const region of regions) {
      try {
        console.log(`Fetching trails for ${region.name} region...`);
        
        const result = await this.getTrails({
          lat: region.lat,
          lon: region.lon,
          maxDistance: 200, // 200 mile radius
          maxResults: batchSize,
          sort: 'quality'
        });
        
        if (result.trails && result.trails.length > 0) {
          allTrails.push(...result.trails);
          console.log(`Added ${result.trails.length} trails from ${region.name}`);
        }
        
        // Rate limiting - wait 1 second between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error fetching trails for ${region.name}:`, error);
        // Continue with other regions even if one fails
      }
    }

    // Remove duplicates based on trail ID
    const uniqueTrails = allTrails.reduce((acc, trail) => {
      if (!acc.find(t => t.id === trail.id)) {
        acc.push(trail);
      }
      return acc;
    }, [] as HikingProjectTrail[]);

    console.log(`Total unique trails fetched: ${uniqueTrails.length}`);
    return uniqueTrails;
  }
}
