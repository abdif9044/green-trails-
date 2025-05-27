
import { USGSTrail } from '@/utils/trail-data-normalizer';

export class USGSAPI {
  private baseUrl = 'https://www.nps.gov/api/v1';
  private apiKey: string;

  constructor(apiKey?: string) {
    // NPS API doesn't require a key but has rate limits
    this.apiKey = apiKey || '';
  }

  async getParks(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/parks?limit=500&api_key=${this.apiKey}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching parks from NPS API:', error);
      throw error;
    }
  }

  async getTrailsForPark(parkCode: string): Promise<any[]> {
    try {
      // NPS doesn't have a specific trails endpoint, so we'll use activities
      const response = await fetch(`${this.baseUrl}/activities/parks?q=${parkCode}&api_key=${this.apiKey}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error(`Error fetching trails for park ${parkCode}:`, error);
      throw error;
    }
  }

  // Since USGS/NPS doesn't have a comprehensive trails API,
  // we'll simulate trail data based on park information
  async generateTrailsFromParks(): Promise<USGSTrail[]> {
    const parks = await this.getParks();
    const trails: USGSTrail[] = [];

    const trailTypes = ['hiking', 'backpacking', 'nature walk', 'interpretive trail'];
    const difficulties = ['easy', 'moderate', 'hard', 'expert'];
    const surfaces = ['dirt', 'gravel', 'paved', 'rock', 'boardwalk'];

    for (const park of parks.slice(0, 100)) { // Limit to first 100 parks
      if (!park.latitude || !park.longitude) continue;

      // Generate 1-5 trails per park
      const trailCount = Math.floor(Math.random() * 5) + 1;
      
      for (let i = 0; i < trailCount; i++) {
        const trail: USGSTrail = {
          id: `${park.parkCode}-trail-${i + 1}`,
          name: `${park.name} Trail ${i + 1}`,
          description: `A beautiful trail in ${park.name}. ${park.description?.substring(0, 200) || ''}`,
          park_name: park.name,
          state: park.states || 'Unknown',
          coordinates: {
            lat: parseFloat(park.latitude) + (Math.random() - 0.5) * 0.1, // Small variation
            lng: parseFloat(park.longitude) + (Math.random() - 0.5) * 0.1
          },
          length_miles: Math.round((Math.random() * 15 + 0.5) * 10) / 10, // 0.5 to 15.5 miles
          elevation_gain_ft: Math.floor(Math.random() * 2000), // 0 to 2000 ft
          difficulty_rating: difficulties[Math.floor(Math.random() * difficulties.length)],
          trail_type: trailTypes[Math.floor(Math.random() * trailTypes.length)],
          surface_type: surfaces[Math.floor(Math.random() * surfaces.length)]
        };

        trails.push(trail);
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`Generated ${trails.length} trails from ${parks.length} parks`);
    return trails;
  }
}
