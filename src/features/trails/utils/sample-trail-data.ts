
import { Trail } from '@/types/trails';
import { forestTrails } from './sample-data/forest-trails';
import { mountainTrails } from './sample-data/mountain-trails';
import { urbanTrails } from './sample-data/urban-trails';
import { specialtyTrails } from './sample-data/specialty-trails';
import { localTrails } from './sample-data/local-trails';

// Create sample trails data for development/fallback
export const createSampleTrails = (): Trail[] => {
  // Combine all trail categories
  return [
    ...localTrails,
    ...forestTrails,
    ...mountainTrails, 
    ...urbanTrails,
    ...specialtyTrails
  ];
};
