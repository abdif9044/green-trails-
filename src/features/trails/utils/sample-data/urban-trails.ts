
import { Trail } from '@/types/trails';
import { createBaseTrail } from './trail-types';

// Sample urban trails data
export const urbanTrails: Trail[] = [
  {
    ...createBaseTrail(
      'urban-1',
      'Central Park Loop',
      'New York City, NY',
      'https://images.unsplash.com/photo-1507992781348-310259076fe0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'easy',
      [-73.9665, 40.7812]
    ),
    length: 6.1,
    elevation: 150,
    elevation_gain: 80,
    tags: ['urban', 'park', 'iconic', 'city'],
    description: 'A classic urban hike through Central Park. The loop passes by famous landmarks including Bethesda Fountain, The Mall, and Strawberry Fields.',
  },
  {
    ...createBaseTrail(
      'urban-2',
      'Golden Gate Park Trail',
      'San Francisco, CA',
      'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80',
      'easy',
      [-122.4836, 37.7692]
    ),
    length: 4.5,
    elevation: 200,
    elevation_gain: 120,
    tags: ['urban', 'park', 'gardens', 'museums'],
    description: 'Explore the cultural and natural attractions of Golden Gate Park. The trail passes by the Conservatory of Flowers, Japanese Tea Garden, and California Academy of Sciences.',
  },
  {
    ...createBaseTrail(
      'urban-3',
      'Highline Elevated Park',
      'New York City, NY',
      'https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'easy',
      [-74.0048, 40.7480]
    ),
    length: 1.45,
    elevation: 30,
    elevation_gain: 10,
    tags: ['urban', 'elevated', 'art', 'accessible'],
    description: 'A unique urban walking experience on a former elevated rail line. The Highline features gardens, art installations, and great views of the city.',
  }
];
