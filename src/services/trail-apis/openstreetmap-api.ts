
import { OSMTrail } from '@/utils/trail-data-normalizer';

export class OpenStreetMapAPI {
  private overpassUrl = 'https://overpass-api.de/api/interpreter';

  async getHikingTrails(bbox?: {
    south: number;
    west: number;
    north: number;
    east: number;
  }, timeout: number = 180): Promise<OSMTrail[]> {
    
    // Overpass QL query for hiking trails
    let query = `[out:json][timeout:${timeout}];\n`;
    
    if (bbox) {
      // Query within bounding box
      query += `(
        relation["route"="hiking"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
        relation["route"="foot"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
        way["highway"="path"]["foot"!="no"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
        way["highway"="footway"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
      );`;
    } else {
      // Global query (use with caution!)
      query += `(
        relation["route"="hiking"];
        relation["route"="foot"];
      );`;
    }
    
    query += '\nout body;\n>;\nout skel qt;';

    try {
      const response = await fetch(this.overpassUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(query)}`
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.elements) {
        return [];
      }

      return data.elements.filter((element: any) => 
        element.type === 'relation' && 
        (element.tags?.route === 'hiking' || element.tags?.route === 'foot')
      );
      
    } catch (error) {
      console.error('Error fetching from OpenStreetMap Overpass API:', error);
      throw error;
    }
  }

  // Get trails by regions to avoid overwhelming the API
  async getTrailsByRegions(regions: Array<{
    name: string;
    bbox: { south: number; west: number; north: number; east: number };
  }>): Promise<OSMTrail[]> {
    const allTrails: OSMTrail[] = [];

    for (const region of regions) {
      try {
        console.log(`Fetching OSM trails for ${region.name}...`);
        
        const trails = await this.getHikingTrails(region.bbox);
        
        if (trails && trails.length > 0) {
          allTrails.push(...trails);
          console.log(`Added ${trails.length} trails from ${region.name}`);
        }
        
        // Rate limiting - wait 2 seconds between requests
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`Error fetching OSM trails for ${region.name}:`, error);
        // Continue with other regions
      }
    }

    console.log(`Total OSM trails fetched: ${allTrails.length}`);
    return allTrails;
  }

  // Predefined regions for major hiking areas
  getPopularHikingRegions() {
    return [
      {
        name: 'Colorado Rockies',
        bbox: { south: 37.0, west: -109.0, north: 41.0, east: -102.0 }
      },
      {
        name: 'California Sierra Nevada',
        bbox: { south: 35.5, west: -120.0, north: 38.5, east: -117.0 }
      },
      {
        name: 'Washington Cascades',
        bbox: { south: 45.5, west: -122.5, north: 48.5, east: -120.0 }
      },
      {
        name: 'Oregon Cascades',
        bbox: { south: 42.0, west: -125.0, north: 46.0, east: -120.0 }
      },
      {
        name: 'Utah National Parks',
        bbox: { south: 37.0, west: -114.0, north: 42.0, east: -109.0 }
      },
      {
        name: 'Montana Glacier',
        bbox: { south: 48.0, west: -115.0, north: 49.0, east: -113.0 }
      },
      {
        name: 'Appalachian Mountains',
        bbox: { south: 33.0, west: -85.0, north: 46.0, east: -75.0 }
      },
      {
        name: 'Great Smoky Mountains',
        bbox: { south: 35.4, west: -84.0, north: 35.8, east: -83.0 }
      }
    ];
  }
}
