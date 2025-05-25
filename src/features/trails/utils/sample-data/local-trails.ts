
import { Trail } from '@/types/trails';

export const localTrails: Trail[] = [
  {
    id: 'local-1',
    name: 'Riverside Walking Path',
    location: 'Downtown Park, Local City',
    difficulty: 'easy',
    length: 2.1,
    elevation: 15,
    elevation_gain: 15,
    imageUrl: '/placeholder.svg',
    tags: ['paved', 'family friendly', 'river views', 'accessible'],
    likes: 127,
    coordinates: [40.7589, -73.9851],
    description: 'A peaceful paved path along the river, perfect for families and casual walkers.'
  },
  {
    id: 'local-2', 
    name: 'City Hill Loop',
    location: 'Hilltop Park, Local City',
    difficulty: 'moderate',
    length: 3.4,
    elevation: 180,
    elevation_gain: 180,
    imageUrl: '/placeholder.svg',
    tags: ['loop trail', 'city views', 'moderate climb'],
    likes: 89,
    coordinates: [40.7505, -73.9934],
    description: 'A moderate loop with great views of the city skyline from the hilltop.'
  },
  {
    id: 'local-3',
    name: 'Nature Reserve Trail',
    location: 'Green Valley Reserve, Local City',
    difficulty: 'easy',
    length: 1.8,
    elevation: 45,
    elevation_gain: 45,
    imageUrl: '/placeholder.svg',
    tags: ['nature reserve', 'wildlife', 'boardwalk', 'educational'],
    likes: 156,
    coordinates: [40.7282, -74.0776],
    description: 'Educational trail through the nature reserve with wildlife viewing opportunities.'
  }
];
