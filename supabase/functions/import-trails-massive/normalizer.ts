
// Re-export the normalization utilities for the edge function
// This duplicates the TypeScript code to make it available in Deno environment

export interface HikingProjectTrail {
  id: number;
  name: string;
  summary: string;
  difficulty: string;
  stars: number;
  starVotes: number;
  location: string;
  url: string;
  imgSqSmall: string;
  imgSmall: string;
  imgSmallMed: string;
  imgMedium: string;
  length: number;
  ascent: number;
  descent: number;
  high: number;
  low: number;
  longitude: number;
  latitude: number;
  conditionStatus: string;
  conditionDetails: string;
  conditionDate: string;
}

export interface OSMTrail {
  id: number;
  type: string;
  tags: {
    name?: string;
    route?: string;
    description?: string;
    sac_scale?: string;
    difficulty?: string;
    surface?: string;
    trail_visibility?: string;
    distance?: string;
    operator?: string;
    website?: string;
  };
  members?: Array<{
    type: string;
    ref: number;
    role: string;
  }>;
  geometry?: {
    type: string;
    coordinates: number[][];
  };
}

export interface USGSTrail {
  id: string;
  name: string;
  description?: string;
  park_name?: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  length_miles?: number;
  elevation_gain_ft?: number;
  difficulty_rating?: string;
  trail_type?: string;
  surface_type?: string;
}

export interface NormalizedTrail {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  difficulty: 'easy' | 'moderate' | 'hard' | 'expert';
  length: number;
  length_km: number;
  elevation_gain: number;
  elevation: number;
  location: string;
  country: string;
  state_province: string | null;
  surface: string | null;
  trail_type: string | null;
  source: string;
  source_id: string;
  geojson: any | null;
  is_age_restricted: boolean;
}

export function standardizeDifficulty(difficulty: string | undefined): 'easy' | 'moderate' | 'hard' | 'expert' {
  if (!difficulty) return 'moderate';
  
  const lower = difficulty.toLowerCase();
  
  if (lower.includes('green') || lower.includes('easy') || lower.includes('beginner')) {
    return 'easy';
  }
  if (lower.includes('blue') || lower.includes('moderate') || lower.includes('intermediate')) {
    return 'moderate';
  }
  if (lower.includes('black') || lower.includes('hard') || lower.includes('difficult') || lower.includes('advanced')) {
    return 'hard';
  }
  if (lower.includes('expert') || lower.includes('extreme') || lower.includes('technical')) {
    return 'expert';
  }
  
  if (lower.includes('t1') || lower === '1') return 'easy';
  if (lower.includes('t2') || lower.includes('t3') || lower === '2' || lower === '3') return 'moderate';
  if (lower.includes('t4') || lower.includes('t5') || lower === '4' || lower === '5') return 'hard';
  if (lower.includes('t6') || lower === '6') return 'expert';
  
  return 'moderate';
}

export function extractTags(trail: any, source: string): string[] {
  const tags: string[] = [];
  
  if (source === 'hiking_project') {
    const hpTrail = trail as HikingProjectTrail;
    
    if (hpTrail.difficulty?.toLowerCase().includes('green')) tags.push('beginner-friendly');
    if (hpTrail.difficulty?.toLowerCase().includes('black')) tags.push('challenging');
    
    if (hpTrail.stars >= 4.5) tags.push('highly-rated');
    if (hpTrail.stars >= 4.0) tags.push('popular');
    
    if (hpTrail.length > 10) tags.push('long-distance');
    if (hpTrail.length < 3) tags.push('short-hike');
    
    if (hpTrail.ascent > 1000) tags.push('steep');
    if (hpTrail.high > 8000) tags.push('high-altitude');
  }
  
  if (source === 'openstreetmap') {
    const osmTrail = trail as OSMTrail;
    
    if (osmTrail.tags?.surface) tags.push(`surface-${osmTrail.tags.surface}`);
    if (osmTrail.tags?.trail_visibility) tags.push(`visibility-${osmTrail.tags.trail_visibility}`);
    if (osmTrail.tags?.sac_scale) tags.push(`sac-${osmTrail.tags.sac_scale}`);
  }
  
  tags.push('hiking', 'outdoor', 'nature');
  
  return [...new Set(tags)];
}

function extractStateFromLocation(location: string): string | null {
  const statePattern = /,\s*([A-Z]{2})\s*$/;
  const match = location.match(statePattern);
  return match ? match[1] : null;
}

export function normalizeTrail(trail: any, source: string, additionalData?: any): NormalizedTrail {
  switch (source) {
    case 'hiking_project':
      return normalizeHikingProjectTrail(trail as HikingProjectTrail);
    case 'openstreetmap':
      return normalizeOSMTrail(trail as OSMTrail, additionalData?.coordinates || { lat: 0, lng: 0 });
    case 'usgs':
      return normalizeUSGSTrail(trail as USGSTrail);
    default:
      throw new Error(`Unknown trail data source: ${source}`);
  }
}

function normalizeHikingProjectTrail(trail: HikingProjectTrail): NormalizedTrail {
  return {
    id: `hp-${trail.id}`,
    name: trail.name,
    description: trail.summary || null,
    latitude: trail.latitude,
    longitude: trail.longitude,
    difficulty: standardizeDifficulty(trail.difficulty),
    length: trail.length,
    length_km: trail.length * 1.60934,
    elevation_gain: trail.ascent || 0,
    elevation: trail.high || 0,
    location: trail.location,
    country: 'United States',
    state_province: extractStateFromLocation(trail.location),
    surface: null,
    trail_type: 'hiking',
    source: 'hiking_project',
    source_id: trail.id.toString(),
    geojson: null,
    is_age_restricted: false
  };
}

function normalizeOSMTrail(trail: OSMTrail, coordinates: { lat: number; lng: number }): NormalizedTrail {
  const tags = trail.tags || {};
  
  return {
    id: `osm-${trail.id}`,
    name: tags.name || `Trail ${trail.id}`,
    description: tags.description || null,
    latitude: coordinates.lat,
    longitude: coordinates.lng,
    difficulty: standardizeDifficulty(tags.sac_scale || tags.difficulty),
    length: parseFloat(tags.distance || '0') || 5,
    length_km: parseFloat(tags.distance || '0') || 5,
    elevation_gain: 200,
    elevation: 500,
    location: 'Unknown Location',
    country: 'Unknown',
    state_province: null,
    surface: tags.surface || null,
    trail_type: tags.route || 'hiking',
    source: 'openstreetmap',
    source_id: trail.id.toString(),
    geojson: trail.geometry || null,
    is_age_restricted: false
  };
}

function normalizeUSGSTrail(trail: USGSTrail): NormalizedTrail {
  return {
    id: `usgs-${trail.id}`,
    name: trail.name,
    description: trail.description || null,
    latitude: trail.coordinates.lat,
    longitude: trail.coordinates.lng,
    difficulty: standardizeDifficulty(trail.difficulty_rating),
    length: trail.length_miles || 0,
    length_km: (trail.length_miles || 0) * 1.60934,
    elevation_gain: trail.elevation_gain_ft || 0,
    elevation: 0,
    location: trail.park_name ? `${trail.park_name}, ${trail.state}` : trail.state,
    country: 'United States',
    state_province: trail.state,
    surface: trail.surface_type || null,
    trail_type: trail.trail_type || 'hiking',
    source: 'usgs',
    source_id: trail.id,
    geojson: null,
    is_age_restricted: false
  };
}
