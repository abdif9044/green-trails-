
import { Trail } from '@/types/trails';
import { createBaseTrail } from './trail-types';

// Sample specialty trails data
export const specialtyTrails: Trail[] = [
  {
    ...createBaseTrail(
      'specialty-1',
      'Desert Bloom Trail',
      'Arizona, USA',
      'https://images.unsplash.com/photo-1587223075055-82e9a937ddff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1353&q=80',
      'moderate',
      [-111.0937, 32.2226]
    ),
    length: 5.6,
    elevation: 650,
    elevation_gain: 280,
    tags: ['desert', 'cactus', 'wildflowers', 'sunrise'],
    description: 'Experience the magical desert bloom in spring. This trail winds through saguaro cacti and is best hiked early morning to avoid the heat.',
    isAgeRestricted: false,
  },
  {
    ...createBaseTrail(
      'specialty-2',
      'Cannabis Farm Tour Trail',
      'Humboldt County, CA',
      'https://images.unsplash.com/photo-1536282915566-c0e101d5bbc4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1347&q=80',
      'easy',
      [-123.7639, 40.7450]
    ),
    length: 2.3,
    elevation: 150,
    elevation_gain: 80,
    tags: ['cannabis', 'farm', 'educational', 'tours'],
    strainTags: [
      {
        name: 'Humboldt Dream',
        type: 'hybrid',
        effects: ['relaxing', 'euphoric', 'creative'],
        description: 'A local favorite strain that enhances the natural beauty of the redwoods.'
      },
      {
        name: 'Farm Fresh',
        type: 'hybrid',
        effects: ['uplifting', 'focused', 'energetic'],
        description: 'Perfect for an educational farm tour experience.'
      }
    ],
    description: 'An educational trail that goes through sustainable cannabis farms. Learn about cultivation practices and the history of cannabis farming in Humboldt County.',
    isAgeRestricted: true,
  },
  {
    ...createBaseTrail(
      'specialty-3',
      'Coastal Meditation Path',
      'Big Sur, CA',
      'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'easy',
      [-121.8369, 36.2704]
    ),
    length: 1.8,
    elevation: 100,
    elevation_gain: 50,
    tags: ['coastal', 'meditation', 'wellness', 'zen'],
    strainTags: [
      {
        name: 'Ocean Breeze',
        type: 'hybrid',
        effects: ['relaxing', 'calming', 'creative'],
        description: 'Enhances the meditative experience with coastal views.'
      }
    ],
    description: 'A peaceful trail designed for meditation and mindfulness. Features several seating areas overlooking the Pacific Ocean.',
    isAgeRestricted: true,
  }
];
