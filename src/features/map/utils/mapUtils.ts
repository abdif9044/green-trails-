
import { supabase } from '@/integrations/supabase/client';

// Fallback token to use if Supabase function fails
const FALLBACK_MAPBOX_TOKEN = 'pk.eyJ1IjoiZ3Ryb2FtaWUiLCJhIjoiY21iNzF1YjltMDY4MjJubjVsMm4wbml6eiJ9.HTW9ugjeNZTbK9mafphIQQ';

// Cache for the Mapbox token to avoid frequent API calls
let cachedToken: string | null = null;
let tokenExpiryTime: number | null = null;

/**
 * Gets the Mapbox access token from the Supabase Edge Function
 * Falls back to a default token if the function call fails
 */
export const getMapboxToken = async (): Promise<string> => {
  try {
    console.log('🗺️ Getting Mapbox token...');
    
    // If we have a cached token and it's not expired, use it
    const now = Date.now();
    if (cachedToken && tokenExpiryTime && now < tokenExpiryTime) {
      console.log('🗺️ Using cached Mapbox token');
      return cachedToken;
    }

    // Call the Supabase Edge Function to get the token
    const { data, error } = await supabase.functions.invoke('get-mapbox-token');
    
    if (error) {
      console.error('🗺️ Error getting Mapbox token from Supabase:', error);
      console.log('🗺️ Using fallback token');
      return FALLBACK_MAPBOX_TOKEN;
    }
    
    if (data && data.token) {
      console.log('🗺️ Successfully retrieved Mapbox token from Supabase');
      // Cache the token for 30 minutes
      cachedToken = data.token;
      tokenExpiryTime = Date.now() + 30 * 60 * 1000;
      return data.token;
    }
    
    console.log('🗺️ No token in response, using fallback');
    return FALLBACK_MAPBOX_TOKEN;
  } catch (error) {
    console.error('🗺️ Failed to get Mapbox token:', error);
    console.log('🗺️ Using fallback token');
    return FALLBACK_MAPBOX_TOKEN;
  }
};

/**
 * Clears the cached Mapbox token, forcing a new fetch on next request
 */
export const clearMapboxTokenCache = (): void => {
  cachedToken = null;
  tokenExpiryTime = null;
};

/**
 * Returns an appropriate color based on trail difficulty
 */
export const getTrailColor = (difficulty: string = 'moderate'): string => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return '#4ade80'; // green
    case 'moderate':
      return '#fbbf24'; // amber
    case 'hard':
      return '#f87171'; // red
    case 'expert':
      return '#8b5cf6'; // purple
    default:
      return '#60a5fa'; // blue
  }
};

/**
 * Validates coordinates to ensure they are valid numbers
 */
export const validateCoordinates = (coordinates: any): [number, number] | null => {
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    return null;
  }
  
  const [lng, lat] = coordinates;
  const numLng = parseFloat(String(lng));
  const numLat = parseFloat(String(lat));
  
  if (isNaN(numLng) || isNaN(numLat) || !isFinite(numLng) || !isFinite(numLat)) {
    return null;
  }
  
  // Basic sanity checks for coordinate ranges
  if (numLat < -90 || numLat > 90 || numLng < -180 || numLng > 180) {
    return null;
  }
  
  return [numLng, numLat];
};
