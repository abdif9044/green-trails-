
import { TrailData } from './types.ts';

const validDifficulties: Array<'easy' | 'moderate' | 'hard' | 'expert'> = ['easy', 'moderate', 'hard', 'expert'];
const terrainTypes = ['forest', 'mountain', 'desert', 'coastal', 'prairie'];
const states = ['California', 'Colorado', 'Washington', 'Utah', 'Arizona', 'Montana'];

export function getStateCoords(state: string) {
  const coords: Record<string, { lat: number; lng: number }> = {
    'California': { lat: 36.7783, lng: -119.4179 },
    'Colorado': { lat: 39.5501, lng: -105.7821 },
    'Washington': { lat: 47.7511, lng: -120.7401 },
    'Utah': { lat: 39.3210, lng: -111.0937 },
    'Arizona': { lat: 34.0489, lng: -111.0937 },
    'Montana': { lat: 47.0527, lng: -109.6333 }
  };
  return coords[state] || { lat: 39.8283, lng: -98.5795 };
}

export function getTrailPrefix(terrain: string): string {
  const prefixes: Record<string, string[]> = {
    mountain: ['Summit', 'Peak', 'Ridge', 'Alpine'],
    forest: ['Woodland', 'Cedar', 'Pine', 'Oak'],
    desert: ['Canyon', 'Mesa', 'Arroyo', 'Dune'],
    coastal: ['Shoreline', 'Cliff', 'Bay', 'Lighthouse'],
    prairie: ['Meadow', 'Valley', 'Rolling', 'Open']
  };
  const options = prefixes[terrain] || ['Scenic', 'Nature'];
  return options[Math.floor(Math.random() * options.length)];
}

export function getTrailSuffix(): string {
  const suffixes = ['Trail', 'Path', 'Loop', 'Way', 'Route'];
  return suffixes[Math.floor(Math.random() * suffixes.length)];
}

export function getDifficultyDescription(difficulty: string): string {
  const descriptions: Record<string, string> = {
    easy: 'families and beginners',
    moderate: 'intermediate hikers',
    hard: 'experienced hikers',
    expert: 'advanced adventurers'
  };
  return descriptions[difficulty] || 'all skill levels';
}

export function getRegion(state: string): string {
  const regions: Record<string, string> = {
    'California': 'West Coast',
    'Colorado': 'Rocky Mountains',
    'Washington': 'Pacific Northwest',
    'Utah': 'Southwest',
    'Arizona': 'Southwest',
    'Montana': 'Northern Rockies'
  };
  return regions[state] || 'United States';
}

export function generateTrails(maxTrails: number): TrailData[] {
  const trails: TrailData[] = [];
  
  for (let i = 0; i < maxTrails; i++) {
    const state = states[i % states.length];
    const difficulty = validDifficulties[i % validDifficulties.length];
    const terrainType = terrainTypes[i % terrainTypes.length];
    
    // Generate coordinates based on state
    const baseCoords = getStateCoords(state);
    const latVariation = (Math.random() - 0.5) * 2;
    const lngVariation = (Math.random() - 0.5) * 4;
    
    const trail: TrailData = {
      id: crypto.randomUUID(),
      name: `${getTrailPrefix(terrainType)} ${getTrailSuffix()} ${i + 1}`,
      location: `${state}, USA`,
      description: `Beautiful ${difficulty} ${terrainType} trail in ${state}. Perfect for ${getDifficultyDescription(difficulty)}.`,
      difficulty,
      terrain_type: terrainType,
      length: Math.round((1 + Math.random() * 10) * 100) / 100,
      elevation: Math.round(500 + Math.random() * 3000),
      elevation_gain: Math.round(100 + Math.random() * 2000),
      latitude: baseCoords.lat + latVariation,
      longitude: baseCoords.lng + lngVariation,
      country: 'United States',
      state_province: state,
      region: getRegion(state),
      is_verified: Math.random() > 0.3,
      is_age_restricted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    trails.push(trail);
  }
  
  return trails;
}
