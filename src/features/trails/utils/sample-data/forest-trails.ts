
import { Trail } from '@/types/trails';
import { createBaseTrail, createGeoJsonLineString } from './trail-types';

// Sample forest trails data
export const forestTrails: Trail[] = [
  {
    ...createBaseTrail(
      'forest-1',
      'Redwood National Park Trail',
      'California, USA',
      'https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80',
      'moderate',
      [-124.0046, 41.2132]
    ),
    length: 8.2,
    elevation: 1200,
    elevation_gain: 450,
    tags: ['forest', 'redwoods', 'national park', 'scenic'],
    geojson: createGeoJsonLineString([
      [-124.0046, 41.2132],
      [-124.0146, 41.2232],
      [-124.0246, 41.2332],
      [-124.0346, 41.2232]
    ]),
    description: 'A beautiful hike through ancient redwood forests with towering trees that are thousands of years old. The trail offers several viewpoints of the Pacific Ocean and passes by several streams.',
  },
  {
    ...createBaseTrail(
      'forest-2',
      'Olympic National Forest Trail',
      'Washington, USA',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'hard',
      [-123.6000, 47.8033]
    ),
    length: 12.5,
    elevation: 2300,
    elevation_gain: 980,
    tags: ['forest', 'rainforest', 'moss', 'ferns'],
    geojson: createGeoJsonLineString([
      [-123.6000, 47.8033],
      [-123.6100, 47.8133],
      [-123.6200, 47.8233],
      [-123.6300, 47.8333]
    ]),
    description: 'This challenging trail takes you through the heart of the Olympic rainforest. Expect lush greenery, moss-covered trees, and possibly some wildlife sightings including elk and black bears.',
  },
  {
    ...createBaseTrail(
      'forest-3',
      'Smoky Mountains Trail',
      'Tennessee, USA',
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80',
      'easy',
      [-83.5085, 35.6532]
    ),
    length: 4.8,
    elevation: 850,
    elevation_gain: 230,
    tags: ['forest', 'mountains', 'family-friendly', 'waterfall'],
    description: 'An easy trail suitable for all skill levels. This hike features beautiful wildflowers in spring and colorful foliage in fall. The trail ends at a picturesque waterfall.',
  }
];
