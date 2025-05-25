
import { Trail } from '@/types/trails';
import { createBaseTrail } from './trail-types';

export const urbanTrails: Trail[] = [
  createBaseTrail({
    id: 'urban-1',
    name: 'Downtown Riverfront Path',
    location: 'Portland, Oregon',
    difficulty: 'easy',
    length: 4.8,
    elevation: 25,
    elevation_gain: 25,
    tags: ['urban', 'paved', 'river views', 'bike friendly'],
    likes: 234,
    coordinates: [45.5152, -122.6784],
    description: 'A paved riverside path perfect for walking, jogging, or cycling through the heart of the city.'
  }),
  createBaseTrail({
    id: 'urban-2',
    name: 'Central Park Loop',
    location: 'New York City, New York',
    difficulty: 'easy',
    length: 6.1,
    elevation: 60,
    elevation_gain: 60,
    tags: ['urban park', 'paved', 'scenic', 'popular'],
    likes: 892,
    coordinates: [40.7829, -73.9654],
    description: 'The classic Central Park loop offering a green oasis in the middle of Manhattan.'
  })
];
