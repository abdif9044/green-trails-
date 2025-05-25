
import { Trail } from '@/types/trails';
import { createBaseTrail, createGeoJsonLineString } from './trail-types';

export const forestTrails: Trail[] = [
  createBaseTrail({
    id: 'forest-1',
    name: 'Whispering Pines Trail',
    location: 'Olympic National Forest, Washington',
    difficulty: 'moderate',
    length: 6.4,
    elevation: 1200,
    elevation_gain: 600,
    tags: ['forest', 'pine trees', 'moderate climb', 'wildlife'],
    likes: 289,
    coordinates: [47.8021, -123.6044],
    description: 'A serene forest trail winding through towering pine trees with occasional wildlife sightings.',
    geojson: createGeoJsonLineString([
      [-123.6044, 47.8021],
      [-123.6050, 47.8025],
      [-123.6055, 47.8030]
    ])
  }),
  createBaseTrail({
    id: 'forest-2',
    name: 'Redwood Giants Loop',
    location: 'Redwood National Park, California',
    difficulty: 'easy',
    length: 3.2,
    elevation: 300,
    elevation_gain: 100,
    tags: ['redwoods', 'old growth', 'easy walk', 'family friendly'],
    likes: 567,
    coordinates: [41.2132, -124.0046],
    description: 'Walk among some of the tallest trees on Earth on this easy, family-friendly loop trail.',
    geojson: createGeoJsonLineString([
      [-124.0046, 41.2132],
      [-124.0050, 41.2135],
      [-124.0052, 41.2138]
    ])
  })
];
