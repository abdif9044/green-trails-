
import { Trail } from '@/types/trails';

export const mockTrails: Trail[] = [
  {
    id: '1',
    name: 'Eagle Peak Trail',
    location: 'Rocky Mountain National Park, CO',
    imageUrl: '/placeholder.svg',
    difficulty: 'moderate',
    length: 4.2,
    elevation: 9850,
    elevation_gain: 1200,
    tags: ['mountain views', 'wildlife', 'photography'],
    likes: 245,
    coordinates: [-105.6836, 40.3428],
    description: 'A beautiful trail with stunning mountain views and diverse wildlife.'
  },
  {
    id: '2',
    name: 'Sunset Beach Walk',
    location: 'Pacific Coast, CA',
    imageUrl: '/placeholder.svg',
    difficulty: 'easy',
    length: 2.1,
    elevation: 50,
    elevation_gain: 25,
    tags: ['sunset views', 'beach', 'family friendly'],
    likes: 189,
    coordinates: [-121.9018, 36.9741],
    description: 'Perfect evening walk along the pristine coastline.'
  },
  {
    id: '3',
    name: 'Forest Loop Trail',
    location: 'Olympic National Forest, WA',
    imageUrl: '/placeholder.svg',
    difficulty: 'easy',
    length: 3.5,
    elevation: 400,
    elevation_gain: 150,
    tags: ['forest', 'loop trail', 'beginner friendly'],
    likes: 156,
    coordinates: [-123.4307, 47.8021],
    description: 'Peaceful loop through old-growth forest with gentle elevation changes.'
  },
  {
    id: '4',
    name: 'Desert Canyon Hike',
    location: 'Zion National Park, UT',
    imageUrl: '/placeholder.svg',
    difficulty: 'hard',
    length: 8.3,
    elevation: 5200,
    elevation_gain: 2100,
    tags: ['desert', 'canyon', 'challenging'],
    likes: 312,
    coordinates: [-113.0263, 37.1947],
    description: 'Challenging desert hike through stunning red rock canyons.'
  },
  {
    id: '5',
    name: 'Meadow Vista Trail',
    location: 'Yellowstone National Park, WY',
    imageUrl: '/placeholder.svg',
    difficulty: 'moderate',
    length: 5.7,
    elevation: 7800,
    elevation_gain: 800,
    tags: ['meadows', 'wildflowers', 'scenic views'],
    likes: 198,
    coordinates: [-110.5885, 44.4280],
    description: 'Spring wildflower displays and expansive meadow views.'
  }
];
