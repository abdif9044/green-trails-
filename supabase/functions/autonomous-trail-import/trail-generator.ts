
import { TrailTemplate, GeographicDistribution } from './types.ts';

export class TrailGenerator {
  private usStatesList = [
    'California', 'Colorado', 'Washington', 'Oregon', 'Utah', 'Montana', 
    'Wyoming', 'Idaho', 'Arizona', 'Nevada', 'New Mexico', 'Texas',
    'North Carolina', 'Tennessee', 'Virginia', 'West Virginia', 'Kentucky',
    'Georgia', 'South Carolina', 'Alabama', 'Arkansas', 'Missouri',
    'Illinois', 'Wisconsin', 'Minnesota', 'Michigan', 'Ohio', 'Pennsylvania',
    'New York', 'Vermont', 'New Hampshire', 'Maine', 'Massachusetts',
    'Connecticut', 'Rhode Island', 'New Jersey', 'Delaware', 'Maryland'
  ];
  
  private canadianProvinces = [
    'British Columbia', 'Alberta', 'Ontario', 'Quebec', 'Nova Scotia',
    'New Brunswick', 'Manitoba', 'Saskatchewan', 'Newfoundland and Labrador'
  ];
  
  private terrainTypes = [
    'Mountain', 'Forest', 'Desert', 'Coastal', 'Prairie', 'Canyon',
    'River Valley', 'Lake Shore', 'Alpine', 'Woodland', 'Grassland'
  ];
  
  private trailPrefixes = [
    'Pine', 'Oak', 'Cedar', 'Maple', 'Aspen', 'Birch', 'Willow',
    'Eagle', 'Bear', 'Wolf', 'Deer', 'Fox', 'Hawk', 'Raven',
    'Mountain', 'Valley', 'Ridge', 'Creek', 'River', 'Lake',
    'Summit', 'Vista', 'Canyon', 'Mesa', 'Bluff', 'Falls'
  ];
  
  private trailSuffixes = [
    'Trail', 'Path', 'Loop', 'Route', 'Way', 'Walk', 'Track',
    'Ridge Trail', 'Creek Trail', 'Mountain Trail', 'Valley Trail',
    'Lookout Trail', 'Nature Trail', 'Wilderness Trail'
  ];
  
  async generateTrails(count: number): Promise<TrailTemplate[]> {
    console.log(`🎯 Generating ${count} diverse trail templates...`);
    
    const trails: TrailTemplate[] = [];
    const distribution = this.calculateDistribution(count);
    
    // Generate US trails
    for (let i = 0; i < distribution.us; i++) {
      trails.push(this.generateUSTrail());
    }
    
    // Generate Canadian trails
    for (let i = 0; i < distribution.canada; i++) {
      trails.push(this.generateCanadianTrail());
    }
    
    // Generate Mexican trails
    for (let i = 0; i < distribution.mexico; i++) {
      trails.push(this.generateMexicanTrail());
    }
    
    // Generate global trails
    for (let i = 0; i < distribution.global; i++) {
      trails.push(this.generateGlobalTrail());
    }
    
    console.log(`✅ Generated ${trails.length} trails across ${Object.keys(distribution).length} regions`);
    return trails;
  }
  
  private calculateDistribution(total: number): GeographicDistribution {
    return {
      us: Math.floor(total * 0.6),        // 60% US trails
      canada: Math.floor(total * 0.2),    // 20% Canadian trails
      mexico: Math.floor(total * 0.1),    // 10% Mexican trails
      global: Math.floor(total * 0.1)     // 10% Global trails
    };
  }
  
  private generateUSTrail(): TrailTemplate {
    const state = this.randomChoice(this.usStatesList);
    const coords = this.generateUSCoordinates(state);
    
    return {
      id: crypto.randomUUID(),
      name: this.generateTrailName(),
      location: `${this.generateCityName()}, ${state}`,
      difficulty: this.randomChoice(['easy', 'moderate', 'hard', 'expert'] as const),
      length: this.randomFloat(0.5, 25.0),
      elevation: this.randomInt(0, 14000),
      elevation_gain: this.randomInt(0, 5000),
      latitude: coords.lat,
      longitude: coords.lng,
      description: this.generateDescription(),
      terrain_type: this.randomChoice(this.terrainTypes),
      country: 'United States',
      state_province: state,
      region: this.getUSRegion(state),
      is_verified: Math.random() > 0.3,
      is_age_restricted: Math.random() > 0.9
    };
  }
  
  private generateCanadianTrail(): TrailTemplate {
    const province = this.randomChoice(this.canadianProvinces);
    const coords = this.generateCanadianCoordinates(province);
    
    return {
      id: crypto.randomUUID(),
      name: this.generateTrailName(),
      location: `${this.generateCityName()}, ${province}`,
      difficulty: this.randomChoice(['easy', 'moderate', 'hard', 'expert'] as const),
      length: this.randomFloat(0.5, 30.0),
      elevation: this.randomInt(0, 12000),
      elevation_gain: this.randomInt(0, 4000),
      latitude: coords.lat,
      longitude: coords.lng,
      description: this.generateDescription(),
      terrain_type: this.randomChoice(this.terrainTypes),
      country: 'Canada',
      state_province: province,
      region: 'Canada',
      is_verified: Math.random() > 0.4,
      is_age_restricted: Math.random() > 0.95
    };
  }
  
  private generateMexicanTrail(): TrailTemplate {
    const coords = this.generateMexicanCoordinates();
    
    return {
      id: crypto.randomUUID(),
      name: this.generateTrailName(),
      location: `${this.generateMexicanCityName()}, Mexico`,
      difficulty: this.randomChoice(['easy', 'moderate', 'hard', 'expert'] as const),
      length: this.randomFloat(1.0, 20.0),
      elevation: this.randomInt(0, 18000),
      elevation_gain: this.randomInt(0, 3000),
      latitude: coords.lat,
      longitude: coords.lng,
      description: this.generateDescription(),
      terrain_type: this.randomChoice(this.terrainTypes),
      country: 'Mexico',
      state_province: 'Various',
      region: 'Mexico',
      is_verified: Math.random() > 0.5,
      is_age_restricted: false
    };
  }
  
  private generateGlobalTrail(): TrailTemplate {
    const countries = ['Germany', 'France', 'Italy', 'Spain', 'Norway', 'Sweden', 'Switzerland', 'Austria', 'New Zealand', 'Australia'];
    const country = this.randomChoice(countries);
    const coords = this.generateGlobalCoordinates(country);
    
    return {
      id: crypto.randomUUID(),
      name: this.generateTrailName(),
      location: `${this.generateCityName()}, ${country}`,
      difficulty: this.randomChoice(['easy', 'moderate', 'hard', 'expert'] as const),
      length: this.randomFloat(1.0, 35.0),
      elevation: this.randomInt(0, 15000),
      elevation_gain: this.randomInt(0, 4500),
      latitude: coords.lat,
      longitude: coords.lng,
      description: this.generateDescription(),
      terrain_type: this.randomChoice(this.terrainTypes),
      country: country,
      state_province: 'Various',
      region: 'International',
      is_verified: Math.random() > 0.6,
      is_age_restricted: false
    };
  }
  
  private generateTrailName(): string {
    const prefix = this.randomChoice(this.trailPrefixes);
    const suffix = this.randomChoice(this.trailSuffixes);
    return `${prefix} ${suffix}`;
  }
  
  private generateDescription(): string {
    const descriptions = [
      'A scenic trail offering beautiful views and moderate difficulty.',
      'Perfect for hikers of all skill levels with well-maintained paths.',
      'Challenging terrain with rewarding panoramic vistas at the summit.',
      'Family-friendly trail through diverse ecosystems and wildlife.',
      'Historic route with interpretive signs and cultural significance.',
      'Wilderness experience with pristine natural beauty and solitude.',
      'Popular trail featuring waterfalls and swimming opportunities.',
      'Desert landscape with unique flora and geological formations.',
      'Coastal trail with ocean views and beach access points.',
      'Mountain adventure with alpine lakes and rocky terrain.'
    ];
    return this.randomChoice(descriptions);
  }
  
  private generateCityName(): string {
    const cities = [
      'Pine Ridge', 'Cedar Falls', 'Mountain View', 'River Bend', 'Forest Glen',
      'Eagle Point', 'Bear Creek', 'Sunset Valley', 'Crystal Lake', 'Stone Bridge'
    ];
    return this.randomChoice(cities);
  }
  
  private generateMexicanCityName(): string {
    const cities = [
      'Puerto Vallarta', 'Guadalajara', 'Monterrey', 'Oaxaca', 'San Miguel de Allende',
      'Playa del Carmen', 'Tulum', 'Merida', 'Guanajuato', 'Puebla'
    ];
    return this.randomChoice(cities);
  }
  
  private generateUSCoordinates(state: string): { lat: number; lng: number } {
    // Simplified coordinate generation based on state
    const stateCoords: Record<string, { lat: [number, number]; lng: [number, number] }> = {
      'California': { lat: [32.5, 42.0], lng: [-124.4, -114.1] },
      'Colorado': { lat: [37.0, 41.0], lng: [-109.1, -102.0] },
      'Washington': { lat: [45.5, 49.0], lng: [-124.8, -116.9] },
      'Oregon': { lat: [42.0, 46.3], lng: [-124.6, -116.5] },
      'Utah': { lat: [37.0, 42.0], lng: [-114.0, -109.0] },
      'Montana': { lat: [44.4, 49.0], lng: [-116.1, -104.0] }
    };
    
    const coords = stateCoords[state] || { lat: [39.0, 40.0], lng: [-105.0, -104.0] };
    return {
      lat: this.randomFloat(coords.lat[0], coords.lat[1]),
      lng: this.randomFloat(coords.lng[0], coords.lng[1])
    };
  }
  
  private generateCanadianCoordinates(province: string): { lat: number; lng: number } {
    // Simplified Canadian coordinates
    return {
      lat: this.randomFloat(49.0, 70.0),
      lng: this.randomFloat(-141.0, -52.0)
    };
  }
  
  private generateMexicanCoordinates(): { lat: number; lng: number } {
    return {
      lat: this.randomFloat(14.5, 32.7),
      lng: this.randomFloat(-118.4, -86.7)
    };
  }
  
  private generateGlobalCoordinates(country: string): { lat: number; lng: number } {
    // Very simplified global coordinates
    const coords: Record<string, { lat: [number, number]; lng: [number, number] }> = {
      'Germany': { lat: [47.3, 55.1], lng: [5.9, 15.0] },
      'France': { lat: [41.3, 51.1], lng: [-5.1, 9.6] },
      'New Zealand': { lat: [-47.3, -34.4], lng: [166.4, 178.6] }
    };
    
    const coord = coords[country] || { lat: [45.0, 50.0], lng: [0.0, 10.0] };
    return {
      lat: this.randomFloat(coord.lat[0], coord.lat[1]),
      lng: this.randomFloat(coord.lng[0], coord.lng[1])
    };
  }
  
  private getUSRegion(state: string): string {
    const regions: Record<string, string> = {
      'California': 'West',
      'Colorado': 'West',
      'Washington': 'West',
      'Oregon': 'West',
      'Texas': 'South',
      'Florida': 'South',
      'New York': 'Northeast',
      'Pennsylvania': 'Northeast'
    };
    return regions[state] || 'Unknown';
  }
  
  private randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  private randomFloat(min: number, max: number): number {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100;
  }
}
