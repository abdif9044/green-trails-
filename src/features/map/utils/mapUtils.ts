
import { supabase } from '@/integrations/supabase/client';

// Fallback token to use if Supabase function fails
const FALLBACK_MAPBOX_TOKEN = 'pk.eyJ1IjoiZGVtby1ncmVlbnRyYWlscyIsImEiOiJjbHdnYW9sdTAwbmpvMmp0ZWJvNnQ2cXdxIn0.F7uYVxm9vBqBRdlSIkd4Kg';

// Cache for the Mapbox token to avoid frequent API calls
let cachedToken: string | null = null;
let tokenExpiryTime: number | null = null;

/**
 * Gets the Mapbox access token from the Supabase Edge Function
 * Falls back to a default token if the function call fails
 */
export const getMapboxToken = async (): Promise<string> => {
  try {
    // If we have a cached token and it's not expired, use it
    const now = Date.now();
    if (cachedToken && tokenExpiryTime && now < tokenExpiryTime) {
      return cachedToken;
    }

    // Call the Supabase Edge Function to get the token
    const { data, error } = await supabase.functions.invoke('get-mapbox-token');
    
    if (error) {
      console.error('Error getting Mapbox token:', error);
      return FALLBACK_MAPBOX_TOKEN;
    }
    
    if (data && data.token) {
      // Cache the token for 30 minutes
      cachedToken = data.token;
      tokenExpiryTime = Date.now() + 30 * 60 * 1000;
      return data.token;
    }
    
    return FALLBACK_MAPBOX_TOKEN;
  } catch (error) {
    console.error('Failed to get Mapbox token:', error);
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
