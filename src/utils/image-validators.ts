
import { INVALID_IMAGE_PATTERNS, TRUSTED_IMAGE_DOMAINS, NATURE_IMAGES } from './image-constants';

/**
 * Validates if an image URL is from a trusted source
 */
export const isValidImageSource = (source: string): boolean => {
  if (!source) return false;
  
  // Check against known problematic patterns
  for (const pattern of INVALID_IMAGE_PATTERNS) {
    if (source.toLowerCase().includes(pattern)) {
      return false;
    }
  }
  
  // Only accept sources from trusted domains
  try {
    const url = new URL(source, window.location.origin);
    return TRUSTED_IMAGE_DOMAINS.some(domain => url.hostname.includes(domain));
  } catch {
    // If URL creation fails, reject the source
    return false;
  }
};

/**
 * Gets a nature-themed fallback image based on alt text
 */
export const getNatureFallbackImage = (alt: string, fallbackImage?: string): string => {
  if (!alt) return fallbackImage || NATURE_IMAGES.default;
  
  const altLower = alt.toLowerCase();
  
  for (const [key, value] of Object.entries(NATURE_IMAGES)) {
    if (altLower.includes(key)) {
      return value;
    }
  }
  
  return fallbackImage || NATURE_IMAGES.default;
};
