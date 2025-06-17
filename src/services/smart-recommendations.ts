
// This file now serves as a re-export to maintain backward compatibility
// with existing imports.
// For new code, prefer importing directly from the smart-recommendations module structure.

export { 
  SmartRecommendationService,
  UserDataService,
  TrailScoringService,
  TrailDataService,
  type UserPreferences,
  type TrailInteraction,
  type TrailScore
} from './smart-recommendations/index';
