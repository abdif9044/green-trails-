
import { Trail } from '@/types/trails';
import { createBaseTrail, createGeoJsonLineString } from './trail-types';

// Sample mountain trails data
export const mountainTrails: Trail[] = [
  {
    ...createBaseTrail(
      'mountain-1',
      'Rocky Mountain Summit Trail',
      'Colorado, USA',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'hard',
      [-105.6836, 40.2859]
    ),
    length: 9.8,
    elevation: 3500,
    elevation_gain: 1200,
    tags: ['mountain', 'summit', 'alpine', 'views'],
    geojson: createGeoJsonLineString([
      [-105.6836, 40.2859],
      [-105.6936, 40.2959],
      [-105.7036, 40.3059],
      [-105.7136, 40.3159]
    ]),
    description: 'A challenging trail that rewards hikers with panoramic views from the summit. The trail passes through alpine meadows, dense forests, and rocky terrain.',
  },
  {
    ...createBaseTrail(
      'mountain-2',
      'Sierra Nevada Ridge Trail',
      'California, USA',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?ixlib=rb-1.2.1&auto=format&fit=crop&w=1355&q=80',
      'moderate',
      [-119.5383, 37.8651]
    ),
    length: 7.5,
    elevation: 2800,
    elevation_gain: 950,
    tags: ['mountain', 'ridge', 'lake', 'views'],
    strainTags: [
      {
        name: 'Mountain Haze',
        type: 'hybrid',
        effects: ['energizing', 'creative', 'uplifting'],
        description: 'Perfect for enjoying breathtaking views and maintaining focus on challenging terrain.'
      }
    ],
    description: 'This moderate trail follows a ridge line offering stunning views on both sides. The trail passes by several alpine lakes and is best hiked from July to September.',
  },
  {
    ...createBaseTrail(
      'mountain-3',
      'Appalachian Mountain Loop',
      'Vermont, USA',
      'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'easy',
      [-72.8210, 44.5588]
    ),
    length: 5.2,
    elevation: 1200,
    elevation_gain: 400,
    tags: ['mountain', 'loop', 'forest', 'family-friendly'],
    description: 'A gentle loop trail through the beautiful Appalachian mountains. This trail is especially popular in fall when the foliage changes color.',
  }
];
