
import { Trail } from '@/types/trails';

export const createBaseTrail = (overrides: Partial<Trail>): Trail => {
  return {
    id: '',
    name: '',
    location: '',
    imageUrl: '/placeholder.svg',
    difficulty: 'easy',
    length: 0,
    elevation: 0,
    elevation_gain: 0,
    tags: [],
    likes: 0,
    ...overrides,
  } as Trail;
};

export const createGeoJsonLineString = (coordinates: number[][]) => {
  return {
    type: 'LineString',
    coordinates,
  };
};
