
// Location-aware utilities for trail generation

export function generateLocationAwareGeojson(lat: number, lng: number): any {
  return {
    type: 'Point',
    coordinates: [lng, lat]
  };
}

export function getDefaultStateForSource(sourceType: string): string {
  const defaults: Record<string, string> = {
    'rochester_osm': 'Minnesota',
    'minnesota_usgs': 'Minnesota',
    'local_trails': 'Minnesota',
    'hiking_project': 'California',
    'openstreetmap': 'Colorado',
    'usgs': 'Wyoming',
    'parks_canada': 'Alberta'
  };
  return defaults[sourceType] || 'Minnesota';
}

export function getSourceDisplayName(sourceType: string): string {
  const names: Record<string, string> = {
    'rochester_osm': 'Rochester Parks',
    'minnesota_usgs': 'Minnesota State Parks',
    'local_trails': 'Local Rochester',
    'hiking_project': 'Hiking Project',
    'openstreetmap': 'OpenStreetMap', 
    'usgs': 'USGS'
  };
  return names[sourceType] || sourceType;
}

export function getLocationAwareBaseData(sourceType: string, index: number, location?: { lat: number; lng: number; radius: number; city?: string; state?: string }) {
  const isRochester = location && location.city?.toLowerCase().includes('rochester');
  const isMinnesota = location && location.state?.toLowerCase().includes('minnesota');
  
  // Rochester, MN specific data
  if (isRochester || isMinnesota) {
    const rochesterSources: Record<string, any> = {
      'rochester_osm': {
        displayName: 'Rochester Parks',
        locations: [
          'Silver Lake Park, Rochester, MN',
          'Quarry Hill Nature Center, Rochester, MN', 
          'Chester\'s Kitchen Area, Rochester, MN',
          'Zumbro River Trail, Rochester, MN',
          'Mayowood Stone Barn, Rochester, MN'
        ],
        country: 'United States',
        state_provinces: ['Minnesota'],
        difficulties: ['easy', 'moderate'],
        latitude: 44.0223,
        longitude: -92.4695,
        surfaces: ['paved', 'dirt', 'gravel'],
        features: ['river views', 'prairie wildlife', 'urban trails', 'historic sites']
      },
      'minnesota_usgs': {
        displayName: 'Minnesota State Parks',
        locations: [
          'Whitewater State Park, MN',
          'Forestville/Mystery Cave State Park, MN',
          'Carley State Park, MN',
          'Richard J. Dorer Memorial Forest, MN',
          'Root River State Trail, MN'
        ],
        country: 'United States', 
        state_provinces: ['Minnesota'],
        difficulties: ['moderate', 'hard'],
        latitude: 44.1,
        longitude: -92.3,
        surfaces: ['dirt', 'rock', 'gravel'],
        features: ['bluff country', 'trout streams', 'hardwood forests', 'limestone caves']
      },
      'local_trails': {
        displayName: 'Local Rochester',
        locations: [
          'Mayo Clinic Campus Trails, Rochester, MN',
          'Soldiers Field Veterans Memorial, Rochester, MN',
          'Cascade Lake Park, Rochester, MN',
          'Essex Park Trail, Rochester, MN',
          'Bear Creek Trail, Rochester, MN'
        ],
        country: 'United States',
        state_provinces: ['Minnesota'],
        difficulties: ['easy', 'moderate'],
        latitude: 44.05,
        longitude: -92.5,
        surfaces: ['paved', 'gravel'],
        features: ['accessible trails', 'family-friendly', 'scenic lakes', 'community paths']
      }
    };
    
    const source = rochesterSources[sourceType] || rochesterSources['local_trails'];
    
    return {
      displayName: source.displayName,
      location: source.locations[index % source.locations.length],
      country: source.country,
      state_province: source.state_provinces[index % source.state_provinces.length],
      difficulty: source.difficulties[index % source.difficulties.length],
      latitude: source.latitude + (Math.random() - 0.5) * 0.3,
      longitude: source.longitude + (Math.random() - 0.5) * 0.3,
      surfaces: source.surfaces,
      features: source.features
    };
  }
  
  // Fallback to general sources
  const generalSources: Record<string, any> = {
    'hiking_project': {
      displayName: 'Hiking Project',
      locations: ['Yosemite Valley, CA', 'Grand Canyon, AZ', 'Zion National Park, UT', 'Rocky Mountain NP, CO'],
      country: 'United States',
      state_provinces: ['California', 'Arizona', 'Utah', 'Colorado'],
      difficulties: ['easy', 'moderate', 'hard'],
      latitude: location?.lat || 39.0,
      longitude: location?.lng || -120.0,
      surfaces: ['dirt', 'rock', 'gravel'],
      features: ['scenic views', 'wildlife viewing', 'photography opportunities']
    },
    'openstreetmap': {
      displayName: 'OpenStreetMap',
      locations: ['Pacific Northwest Trail', 'Appalachian Trail Section', 'Continental Divide', 'Great Lakes Trail'],
      country: 'United States',
      state_provinces: [location?.state || 'Washington', 'Virginia', 'Montana', 'Michigan'],
      difficulties: ['easy', 'moderate', 'hard'],
      latitude: location?.lat || 45.0,
      longitude: location?.lng || -110.0,
      surfaces: ['dirt', 'gravel', 'paved'],
      features: ['well-marked trails', 'historic sites', 'diverse ecosystems']
    },
    'usgs': {
      displayName: 'USGS',
      locations: ['Yellowstone Backcountry', 'Grand Teton NP', 'Glacier National Park', 'Olympic Peninsula'],
      country: 'United States',
      state_provinces: [location?.state || 'Wyoming', 'Wyoming', 'Montana', 'Washington'],
      difficulties: ['moderate', 'hard'],
      latitude: location?.lat || 44.5,
      longitude: location?.lng || -110.5,
      surfaces: ['dirt', 'rock'],
      features: ['wilderness experience', 'geological features', 'pristine nature']
    }
  };
  
  const source = generalSources[sourceType] || generalSources['openstreetmap'];
  
  return {
    displayName: source.displayName,
    location: source.locations[index % source.locations.length],
    country: source.country,
    state_province: source.state_provinces[index % source.state_provinces.length],
    difficulty: source.difficulties[index % source.difficulties.length],
    latitude: source.latitude,
    longitude: source.longitude,
    surfaces: source.surfaces,
    features: source.features
  };
}
