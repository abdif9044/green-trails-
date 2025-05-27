
// Trail data normalization utilities for the massive import function

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
  name: string;
  description: string | null;
  location: string;
  country: string;
  state_province: string | null;
  length_km: number;
  length: number;
  elevation_gain: number;
  elevation: number;
  difficulty: 'easy' | 'moderate' | 'hard' | 'expert';
  geojson: any | null;
  latitude: number;
  longitude: number;
  surface: string | null;
  trail_type: string | null;
  is_age_restricted: boolean;
  source: string;
  source_id: string;
  last_updated: string;
}

// Standardize difficulty ratings across different sources
export function standardizeDifficulty(difficulty: string | undefined): 'easy' | 'moderate' | 'hard' | 'expert' {
  if (!difficulty) return 'moderate';
  
  const lower = difficulty.toLowerCase();
  
  // Hiking Project uses "green", "greenBlue", "blue", "blueBlack", "black", "dblack"
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
  
  // SAC scale from OSM (T1-T6)
  if (lower.includes('t1') || lower === '1') return 'easy';
  if (lower.includes('t2') || lower.includes('t3') || lower === '2' || lower === '3') return 'moderate';
  if (lower.includes('t4') || lower.includes('t5') || lower === '4' || lower === '5') return 'hard';
  if (lower.includes('t6') || lower === '6') return 'expert';
  
  return 'moderate'; // Default fallback
}

// Extract relevant tags from trail data
export function extractTags(trail: any, source: string): string[] {
  const tags: string[] = [];
  
  if (source === 'hiking_project') {
    const hpTrail = trail as HikingProjectTrail;
    
    // Add difficulty-based tags
    if (hpTrail.difficulty?.toLowerCase().includes('green')) tags.push('beginner-friendly');
    if (hpTrail.difficulty?.toLowerCase().includes('black')) tags.push('challenging');
    
    // Add rating-based tags
    if (hpTrail.stars >= 4.5) tags.push('highly-rated');
    if (hpTrail.stars >= 4.0) tags.push('popular');
    
    // Add length-based tags
    if (hpTrail.length > 10) tags.push('long-distance');
    if (hpTrail.length < 3) tags.push('short-hike');
    
    // Add elevation-based tags
    if (hpTrail.ascent > 1000) tags.push('steep');
    if (hpTrail.high > 8000) tags.push('high-altitude');
  }
  
  if (source === 'openstreetmap') {
    const osmTrail = trail as OSMTrail;
    
    if (osmTrail.tags?.surface) tags.push(`surface-${osmTrail.tags.surface}`);
    if (osmTrail.tags?.trail_visibility) tags.push(`visibility-${osmTrail.tags.trail_visibility}`);
    if (osmTrail.tags?.sac_scale) tags.push(`sac-${osmTrail.tags.sac_scale}`);
  }
  
  // Add generic tags
  tags.push('hiking', 'outdoor', 'nature');
  
  return [...new Set(tags)]; // Remove duplicates
}

// Main normalization function that handles any trail type
export function normalizeTrail(trail: any, source: string): NormalizedTrail {
  switch (source) {
    case 'hiking_project':
      return normalizeHikingProjectTrail(trail as HikingProjectTrail);
    case 'openstreetmap':
      return normalizeOSMTrail(trail as OSMTrail);
    case 'usgs':
      return normalizeUSGSTrail(trail as USGSTrail);
    default:
      throw new Error(`Unknown trail data source: ${source}`);
  }
}

function normalizeHikingProjectTrail(trail: HikingProjectTrail): NormalizedTrail {
  return {
    name: trail.name,
    description: trail.summary || null,
    location: trail.location,
    country: 'United States', // Hiking Project is US-focused
    state_province: extractStateFromLocation(trail.location),
    length_km: trail.length * 1.60934,
    length: trail.length,
    elevation_gain: trail.ascent || 0,
    elevation: trail.high || 0,
    difficulty: standardizeDifficulty(trail.difficulty),
    geojson: null, // Would need separate API call for GPX data
    latitude: trail.latitude,
    longitude: trail.longitude,
    surface: null, // Not provided by Hiking Project
    trail_type: 'hiking',
    is_age_restricted: false,
    source: 'hiking_project',
    source_id: trail.id.toString(),
    last_updated: new Date().toISOString()
  };
}

function normalizeOSMTrail(trail: OSMTrail): NormalizedTrail {
  const tags = trail.tags || {};
  
  // Calculate centroid for trails without specific coordinates
  let lat = 40.7128; // Default to NYC if no coordinates
  let lng = -74.0060;
  
  if (trail.geometry?.coordinates && trail.geometry.coordinates.length > 0) {
    const coords = trail.geometry.coordinates;
    lat = coords.reduce((sum, coord) => sum + coord[1], 0) / coords.length;
    lng = coords.reduce((sum, coord) => sum + coord[0], 0) / coords.length;
  }
  
  return {
    name: tags.name || `Trail ${trail.id}`,
    description: tags.description || null,
    location: 'Unknown Location', // Would need reverse geocoding
    country: 'Unknown',
    state_province: null,
    length_km: parseFloat(tags.distance || '0') || 5, // Default 5km if not specified
    length: (parseFloat(tags.distance || '0') || 5) / 1.60934, // Convert to miles
    elevation_gain: 200, // Default value, would need elevation service
    elevation: 500, // Default value, would need elevation service
    difficulty: standardizeDifficulty(tags.sac_scale || tags.difficulty),
    geojson: trail.geometry || null,
    latitude: lat,
    longitude: lng,
    surface: tags.surface || null,
    trail_type: tags.route || 'hiking',
    is_age_restricted: false,
    source: 'openstreetmap',
    source_id: trail.id.toString(),
    last_updated: new Date().toISOString()
  };
}

function normalizeUSGSTrail(trail: USGSTrail): NormalizedTrail {
  return {
    name: trail.name,
    description: trail.description || null,
    location: trail.park_name ? `${trail.park_name}, ${trail.state}` : trail.state,
    country: 'United States',
    state_province: trail.state,
    length_km: (trail.length_miles || 0) * 1.60934,
    length: trail.length_miles || 0,
    elevation_gain: trail.elevation_gain_ft || 0,
    elevation: 0, // Would need additional elevation data
    difficulty: standardizeDifficulty(trail.difficulty_rating),
    geojson: null,
    latitude: trail.coordinates.lat,
    longitude: trail.coordinates.lng,
    surface: trail.surface_type || null,
    trail_type: trail.trail_type || 'hiking',
    is_age_restricted: false,
    source: 'usgs',
    source_id: trail.id,
    last_updated: new Date().toISOString()
  };
}

// Helper function to extract state from location string
function extractStateFromLocation(location: string): string | null {
  const statePattern = /,\s*([A-Z]{2})\s*$/;
  const match = location.match(statePattern);
  return match ? match[1] : null;
}
