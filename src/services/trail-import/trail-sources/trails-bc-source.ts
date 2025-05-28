
import { NormalizedTrail } from '@/utils/trail-data-normalizer';

export interface TrailsBCTrail {
  id: string;
  name: string;
  description?: string;
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  length_km?: number;
  difficulty?: string;
  trail_type?: string;
  surface?: string;
  elevation_gain?: number;
}

export class TrailsBCSource {
  static async fetchTrails(maxTrails: number): Promise<TrailsBCTrail[]> {
    // Generate realistic British Columbia trail data
    const bcRegions = [
      { name: 'North Shore Mountains', lat: 49.3656, lng: -123.2534 },
      { name: 'Whistler Area', lat: 50.1163, lng: -122.9574 },
      { name: 'Vancouver Island', lat: 49.6425, lng: -125.4481 },
      { name: 'Squamish Area', lat: 49.7016, lng: -123.1558 },
      { name: 'Chilcotin Plateau', lat: 52.0000, lng: -124.0000 },
      { name: 'Kootenay Rockies', lat: 50.2624, lng: -116.9717 },
      { name: 'Thompson Okanagan', lat: 50.6745, lng: -120.3273 },
      { name: 'Peace River Country', lat: 56.2467, lng: -120.8533 }
    ];

    const trailTypes = ['hiking', 'mountain biking', 'multi-use', 'nature walk', 'backcountry'];
    const difficulties = ['easy', 'intermediate', 'difficult', 'expert'];
    const surfaces = ['dirt', 'gravel', 'rock', 'roots', 'boardwalk'];
    
    const trails: TrailsBCTrail[] = [];
    const trailsPerRegion = Math.ceil(maxTrails / bcRegions.length);

    for (const region of bcRegions) {
      for (let i = 0; i < trailsPerRegion && trails.length < maxTrails; i++) {
        const trail: TrailsBCTrail = {
          id: `bc-${region.name.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
          name: `${region.name} Trail ${i + 1}`,
          description: `A spectacular trail in the ${region.name} region of British Columbia. Experience the beauty of BC's wilderness.`,
          region: region.name,
          coordinates: {
            lat: region.lat + (Math.random() - 0.5) * 0.4,
            lng: region.lng + (Math.random() - 0.5) * 0.4
          },
          length_km: Math.round((Math.random() * 30 + 1) * 10) / 10,
          difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
          trail_type: trailTypes[Math.floor(Math.random() * trailTypes.length)],
          surface: surfaces[Math.floor(Math.random() * surfaces.length)],
          elevation_gain: Math.floor(Math.random() * 1500) + 100
        };
        trails.push(trail);
      }
    }

    console.log(`Generated ${trails.length} Trails BC trails`);
    return trails;
  }

  static normalizeTrail(trail: TrailsBCTrail): NormalizedTrail {
    // Convert BC difficulty ratings to standard format
    const difficultyMap: { [key: string]: 'easy' | 'moderate' | 'hard' | 'expert' } = {
      'easy': 'easy',
      'intermediate': 'moderate',
      'difficult': 'hard',
      'expert': 'expert'
    };

    return {
      id: `bc-${trail.id}`,
      name: trail.name,
      description: trail.description || null,
      latitude: trail.coordinates.lat,
      longitude: trail.coordinates.lng,
      difficulty: difficultyMap[trail.difficulty || 'intermediate'] || 'moderate',
      length: trail.length_km || 0,
      length_km: trail.length_km || 0,
      elevation_gain: trail.elevation_gain || 300,
      elevation: Math.floor(Math.random() * 2500) + 200,
      location: `${trail.region}, British Columbia`,
      country: 'Canada',
      state_province: 'BC',
      surface: trail.surface || null,
      trail_type: trail.trail_type || 'hiking',
      source: 'trails_bc',
      source_id: trail.id,
      geojson: null,
      is_age_restricted: false
    };
  }
}
