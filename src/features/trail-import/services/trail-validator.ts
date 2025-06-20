
// Trail data validation utilities
export interface TrailData {
  name: string;
  location: string;
  difficulty: 'easy' | 'moderate' | 'hard' | 'expert';
  length?: number;
  elevation?: number;
  elevation_gain?: number;
  latitude?: number;
  longitude?: number;
  description?: string;
  terrain_type?: string;
  country?: string;
  state_province?: string;
  region?: string;
}

export class TrailValidator {
  static validateTrail(trail: any): { isValid: boolean; errors: string[]; trail: TrailData | null } {
    const errors: string[] = [];

    // Required fields
    if (!trail.name || typeof trail.name !== 'string' || trail.name.trim().length === 0) {
      errors.push('name is required and must be a non-empty string');
    }

    if (!trail.location || typeof trail.location !== 'string' || trail.location.trim().length === 0) {
      errors.push('location is required and must be a non-empty string');
    }

    // Validate difficulty - CRITICAL: Must match database constraint
    const validDifficulties = ['easy', 'moderate', 'hard', 'expert'];
    if (!trail.difficulty || !validDifficulties.includes(trail.difficulty)) {
      errors.push(`difficulty must be one of: ${validDifficulties.join(', ')}`);
    }

    // Numeric validations
    if (trail.length !== undefined && (typeof trail.length !== 'number' || isNaN(trail.length) || trail.length < 0)) {
      errors.push('length must be a positive number');
    }

    if (trail.elevation !== undefined && (typeof trail.elevation !== 'number' || isNaN(trail.elevation))) {
      errors.push('elevation must be a valid number');
    }

    if (trail.elevation_gain !== undefined && (typeof trail.elevation_gain !== 'number' || isNaN(trail.elevation_gain) || trail.elevation_gain < 0)) {
      errors.push('elevation_gain must be a positive number');
    }

    // Coordinate validations
    if (trail.latitude !== undefined && (typeof trail.latitude !== 'number' || isNaN(trail.latitude) || trail.latitude < -90 || trail.latitude > 90)) {
      errors.push('latitude must be a number between -90 and 90');
    }

    if (trail.longitude !== undefined && (typeof trail.longitude !== 'number' || isNaN(trail.longitude) || trail.longitude < -180 || trail.longitude > 180)) {
      errors.push('longitude must be a number between -180 and 180');
    }

    if (errors.length > 0) {
      return { isValid: false, errors, trail: null };
    }

    // Return validated trail object
    const validatedTrail: TrailData = {
      name: trail.name.trim(),
      location: trail.location.trim(),
      difficulty: trail.difficulty,
      length: trail.length,
      elevation: trail.elevation,
      elevation_gain: trail.elevation_gain,
      latitude: trail.latitude,
      longitude: trail.longitude,
      description: trail.description?.trim(),
      terrain_type: trail.terrain_type?.trim(),
      country: trail.country?.trim(),
      state_province: trail.state_province?.trim(),
      region: trail.region?.trim()
    };

    return { isValid: true, errors: [], trail: validatedTrail };
  }

  static validateBatch(trails: any[]): { valid: TrailData[]; invalid: Array<{ trail: any; errors: string[] }> } {
    const valid: TrailData[] = [];
    const invalid: Array<{ trail: any; errors: string[] }> = [];

    for (const trail of trails) {
      const result = this.validateTrail(trail);
      if (result.isValid && result.trail) {
        valid.push(result.trail);
      } else {
        invalid.push({ trail, errors: result.errors });
      }
    }

    return { valid, invalid };
  }
}
