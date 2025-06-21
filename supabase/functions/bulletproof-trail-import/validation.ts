
import { TrailData, ValidationResult } from './types.ts';

export function validateTrail(trail: TrailData): ValidationResult {
  const errors: string[] = [];
  
  if (!trail.name?.trim()) errors.push('name is required');
  if (!trail.location?.trim()) errors.push('location is required');
  if (!['easy', 'moderate', 'hard', 'expert'].includes(trail.difficulty)) {
    errors.push('difficulty must be easy, moderate, hard, or expert');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    trail: errors.length === 0 ? trail : null
  };
}
