
// Curated nature images for better fallbacks
export const NATURE_IMAGES = {
  forest: "https://images.unsplash.com/photo-1448375240586-882707db888b",
  mountain: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
  lake: "https://images.unsplash.com/photo-1544714042-5dc4f6a3c4ce",
  trail: "https://images.unsplash.com/photo-1551632811-561732d1e306",
  waterfall: "https://images.unsplash.com/photo-1546587348-d12660c30c50",
  valley: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5",
  default: "https://images.unsplash.com/photo-1469474968028-56623f02e42e"
};

// Trusted domains for image validation
export const TRUSTED_IMAGE_DOMAINS = [
  'unsplash.com', 'images.unsplash.com',
  'pexels.com', 'images.pexels.com',
  'githubusercontent.com',
  'greentrails.global', // Our app domain
  'supabase.co', 'supabase.in'
];

// Patterns that indicate invalid or problematic image sources
export const INVALID_IMAGE_PATTERNS = [
  'screen', 'phone', 'mobile', 'device', 'iphone', 'android', 'screenshot',
  'data:image', 'blob:', 'localhost', '127.0.0.1', 'http://localhost',
  'lovable-uploads', 'base64', 'test', 'demo', 'fake'
];
