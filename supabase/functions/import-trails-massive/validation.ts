
// Validation utilities for trail data

export function validateString(value: any, fallback: string): string {
  if (!value || typeof value !== 'string' || value.trim().length === 0) {
    return fallback;
  }
  return value.trim().substring(0, 255);
}

export function ensureValidNumber(value: any, fallback: number): number {
  const num = parseFloat(String(value));
  return isNaN(num) || !isFinite(num) ? fallback : num;
}

export function ensureValidInteger(value: any, fallback: number): number {
  const num = parseInt(String(value));
  return isNaN(num) || !isFinite(num) ? fallback : num;
}

export function ensureValidLatitude(value: any, location?: { lat: number; lng: number; radius: number }): number {
  const num = parseFloat(String(value));
  if (isNaN(num) || !isFinite(num)) {
    return location ? location.lat + (Math.random() - 0.5) * 2 : 40.0 + (Math.random() - 0.5) * 10;
  }
  return Math.max(-90, Math.min(90, num));
}

export function ensureValidLongitude(value: any, location?: { lat: number; lng: number; radius: number }): number {
  const num = parseFloat(String(value));
  if (isNaN(num) || !isFinite(num)) {
    return location ? location.lng + (Math.random() - 0.5) * 2 : -100.0 + (Math.random() - 0.5) * 40;
  }
  return Math.max(-180, Math.min(180, num));
}

export function validateDifficulty(difficulty: any): string {
  const valid = ['easy', 'moderate', 'hard'];
  if (typeof difficulty === 'string' && valid.includes(difficulty.toLowerCase())) {
    return difficulty.toLowerCase();
  }
  return 'moderate';
}

export function validateSurface(surface: any): string {
  const valid = ['dirt', 'gravel', 'paved', 'rock', 'sand', 'grass'];
  if (typeof surface === 'string' && valid.includes(surface.toLowerCase())) {
    return surface.toLowerCase();
  }
  return 'dirt';
}

export function validateTrailSchema(trail: any): string[] {
  const issues: string[] = [];
  
  if (!trail.id || typeof trail.id !== 'string') {
    issues.push('missing/invalid id');
  }
  if (!trail.name || typeof trail.name !== 'string' || trail.name.trim().length === 0) {
    issues.push('missing/empty name');
  }
  if (!trail.location || typeof trail.location !== 'string' || trail.location.trim().length === 0) {
    issues.push('missing/empty location');
  }
  if (!trail.difficulty || !['easy', 'moderate', 'hard'].includes(trail.difficulty)) {
    issues.push('invalid difficulty');
  }
  if (typeof trail.length !== 'number' || trail.length <= 0 || !isFinite(trail.length)) {
    issues.push(`invalid length: ${trail.length}`);
  }
  if (typeof trail.elevation !== 'number' || !isFinite(trail.elevation)) {
    issues.push(`invalid elevation: ${trail.elevation}`);
  }
  if (typeof trail.latitude !== 'number' || trail.latitude < -90 || trail.latitude > 90) {
    issues.push(`invalid latitude: ${trail.latitude}`);
  }
  if (typeof trail.longitude !== 'number' || trail.longitude < -180 || trail.longitude > 180) {
    issues.push(`invalid longitude: ${trail.longitude}`);
  }
  if (!trail.source_id || typeof trail.source_id !== 'string' || trail.source_id.length === 0) {
    issues.push('missing source_id');
  }
  
  return issues;
}
