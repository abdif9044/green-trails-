
import { TrailTemplate } from './types.ts';

export class TrailDataGenerator {
  private difficulties: Array<'easy' | 'moderate' | 'hard' | 'expert'> = ['easy', 'moderate', 'hard', 'expert'];
  private terrainTypes = ['forest', 'mountain', 'desert', 'coastal', 'prairie', 'canyon', 'alpine', 'woodland'];
  private regions = [
    { country: 'United States', states: ['California', 'Colorado', 'Washington', 'Utah', 'Arizona', 'Montana', 'Wyoming', 'Oregon', 'Nevada', 'New Mexico'], coords: { lat: 39.8283, lng: -98.5795 } },
    { country: 'Canada', states: ['British Columbia', 'Alberta', 'Ontario', 'Quebec', 'Nova Scotia', 'Yukon'], coords: { lat: 56.1304, lng: -106.3468 } },
    { country: 'Mexico', states: ['Baja California', 'Sonora', 'Chihuahua', 'Oaxaca', 'Veracruz'], coords: { lat: 23.6345, lng: -102.5528 } }
  ];
  
  generateTrails(count: number): TrailTemplate[] {
    const trails: TrailTemplate[] = [];
    
    for (let i = 0; i < count; i++) {
      const region = this.regions[i % this.regions.length];
      const state = region.states[Math.floor(Math.random() * region.states.length)];
      const difficulty = this.difficulties[i % this.difficulties.length];
      const terrainType = this.terrainTypes[Math.floor(Math.random() * this.terrainTypes.length)];
      
      // Generate realistic coordinates within the region
      const latVariation = (Math.random() - 0.5) * 10; // ±5 degrees
      const lngVariation = (Math.random() - 0.5) * 20; // ±10 degrees
      
      const trail: TrailTemplate = {
        id: crypto.randomUUID(),
        name: this.generateTrailName(terrainType, i + 1),
        location: `${state}, ${region.country}`,
        description: this.generateDescription(difficulty, terrainType, state),
        difficulty,
        terrain_type: terrainType,
        length: this.generateLength(difficulty),
        elevation: this.generateElevation(region.country, terrainType),
        elevation_gain: this.generateElevationGain(difficulty),
        latitude: region.coords.lat + latVariation,
        longitude: region.coords.lng + lngVariation,
        country: region.country,
        state_province: state,
        region: this.getRegionName(region.country),
        is_verified: Math.random() > 0.2, // 80% verified
        is_age_restricted: false // Keep all trails age-unrestricted for simplicity
      };
      
      trails.push(trail);
    }
    
    return trails;
  }
  
  private generateTrailName(terrainType: string, index: number): string {
    const prefixes = {
      mountain: ['Summit', 'Peak', 'Ridge', 'Alpine', 'High'],
      forest: ['Woodland', 'Cedar', 'Pine', 'Oak', 'Maple'],
      desert: ['Canyon', 'Mesa', 'Arroyo', 'Dune', 'Oasis'],
      coastal: ['Shoreline', 'Cliff', 'Bay', 'Lighthouse', 'Tide'],
      prairie: ['Meadow', 'Valley', 'Rolling', 'Open', 'Grass'],
      canyon: ['Red Rock', 'Stone', 'Echo', 'Deep', 'Narrow'],
      alpine: ['Snow', 'Glacier', 'Crystal', 'Ice', 'High'],
      woodland: ['Ancient', 'Whispering', 'Enchanted', 'Misty', 'Secret']
    };
    
    const suffixes = ['Trail', 'Path', 'Loop', 'Way', 'Route', 'Trek', 'Walk', 'Hike'];
    
    const prefix = prefixes[terrainType as keyof typeof prefixes]?.[Math.floor(Math.random() * 5)] || 'Scenic';
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    return `${prefix} ${suffix} #${index}`;
  }
  
  private generateDescription(difficulty: string, terrainType: string, state: string): string {
    const difficultyDescriptions = {
      easy: 'Perfect for families and beginners',
      moderate: 'Great for intermediate hikers',
      hard: 'Challenging trail for experienced hikers',
      expert: 'Demanding adventure for expert hikers only'
    };
    
    return `Beautiful ${difficulty} ${terrainType} trail in ${state}. ${difficultyDescriptions[difficulty as keyof typeof difficultyDescriptions]}. Features stunning views and well-maintained paths.`;
  }
  
  private generateLength(difficulty: string): number {
    const ranges = {
      easy: { min: 0.5, max: 3.0 },
      moderate: { min: 2.0, max: 6.0 },
      hard: { min: 4.0, max: 12.0 },
      expert: { min: 8.0, max: 20.0 }
    };
    
    const range = ranges[difficulty as keyof typeof ranges];
    return Math.round((range.min + Math.random() * (range.max - range.min)) * 100) / 100;
  }
  
  private generateElevation(country: string, terrainType: string): number {
    const baseElevations = {
      'United States': { mountain: 8000, forest: 2000, desert: 1500, coastal: 100, prairie: 800 },
      'Canada': { mountain: 6000, forest: 1500, desert: 1000, coastal: 50, prairie: 600 },
      'Mexico': { mountain: 7000, forest: 1800, desert: 2000, coastal: 80, prairie: 1200 }
    };
    
    const base = baseElevations[country as keyof typeof baseElevations]?.[terrainType as keyof typeof baseElevations['United States']] || 1000;
    return Math.round(base + (Math.random() - 0.5) * base * 0.5);
  }
  
  private generateElevationGain(difficulty: string): number {
    const ranges = {
      easy: { min: 100, max: 500 },
      moderate: { min: 400, max: 1200 },
      hard: { min: 1000, max: 2500 },
      expert: { min: 2000, max: 4000 }
    };
    
    const range = ranges[difficulty as keyof typeof ranges];
    return Math.round(range.min + Math.random() * (range.max - range.min));
  }
  
  private getRegionName(country: string): string {
    const regions = {
      'United States': 'North America',
      'Canada': 'North America', 
      'Mexico': 'North America'
    };
    
    return regions[country as keyof typeof regions] || 'Global';
  }
}
