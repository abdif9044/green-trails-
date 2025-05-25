
import { Trail } from '@/types/trails';

export const specialtyTrails: Trail[] = [
  {
    id: 'specialty-1',
    name: 'Sunset Photography Trail',
    location: 'Joshua Tree National Park, California',
    difficulty: 'easy',
    length: 2.3,
    elevation: 2900,
    elevation_gain: 200,
    imageUrl: '/placeholder.svg',
    tags: ['photography', 'sunset views', 'desert', 'short hike'],
    likes: 445,
    coordinates: [33.8734, -115.9010],
    description: 'Perfect trail for photographers, especially during golden hour.'
  },
  {
    id: 'specialty-2',
    name: 'Mindfulness Forest Path',
    location: 'Redwood National Park, California', 
    difficulty: 'easy',
    length: 1.7,
    elevation: 150,
    elevation_gain: 50,
    imageUrl: '/placeholder.svg',
    tags: ['meditation', 'old growth', 'peaceful', 'forest bathing'],
    likes: 298,
    coordinates: [41.2132, -124.0046],
    description: 'Tranquil path through ancient redwoods, perfect for meditation and reflection.'
  },
  {
    id: 'specialty-3',
    name: 'Astronomical Observatory Trail',
    location: 'Mauna Kea, Hawaii',
    difficulty: 'moderate',
    length: 4.1,
    elevation: 13796,
    elevation_gain: 1200,
    imageUrl: '/placeholder.svg',
    tags: ['stargazing', 'high altitude', 'observatory', 'clear skies'],
    likes: 567,
    coordinates: [19.8207, -155.4681],
    description: 'High-altitude trail to world-class observatories with incredible stargazing.'
  }
];
