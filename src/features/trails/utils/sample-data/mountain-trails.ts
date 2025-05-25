
import { Trail } from '@/types/trails';

export const mountainTrails: Trail[] = [
  {
    id: 'mountain-1',
    name: 'Summit Peak Trail',
    location: 'Rocky Mountain National Park, Colorado',
    difficulty: 'hard',
    length: 8.2,
    elevation: 11459,
    elevation_gain: 2100,
    imageUrl: '/placeholder.svg',
    tags: ['summit', 'alpine', 'challenging', 'scenic views'],
    likes: 342,
    coordinates: [40.3428, -105.6836],
    description: 'Challenging alpine trail to a spectacular summit with 360-degree views.'
  },
  {
    id: 'mountain-2',
    name: 'Cascade Falls Trail', 
    location: 'Mount Rainier National Park, Washington',
    difficulty: 'moderate',
    length: 5.6,
    elevation: 3200,
    elevation_gain: 800,
    imageUrl: '/placeholder.svg',
    tags: ['waterfall', 'forest', 'moderate climb'],
    likes: 267,
    coordinates: [46.8059, -121.7269],
    description: 'Beautiful forest trail leading to a stunning multi-tiered waterfall.'
  }
];
