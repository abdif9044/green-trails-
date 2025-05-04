
import { Trail } from '@/types/trails';

// Helper functions for generating sample trail data
export const createBaseTrail = (
  id: string,
  name: string,
  location: string,
  imageUrl: string,
  difficulty: Trail['difficulty'],
  coordinates: [number, number]
): Trail => {
  return {
    id,
    name,
    location,
    imageUrl,
    difficulty,
    coordinates,
    likes: Math.floor(Math.random() * 200) + 20,
    isAgeRestricted: Math.random() > 0.7, // ~30% of trails are age restricted
    tags: [],
    length: 0,
    elevation: 0,
    elevation_gain: 0,
    description: '',
  };
};

export const createGeoJsonLineString = (
  coordinates: Array<[number, number]>
): Trail['geojson'] => {
  return {
    type: "FeatureCollection",
    features: [{
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates
      }
    }]
  };
};
