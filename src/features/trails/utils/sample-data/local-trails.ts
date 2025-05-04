
import { Trail } from '@/types/trails';
import { createBaseTrail } from './trail-types';

// Sample local trails data
export const localTrails: Trail[] = [
  {
    ...createBaseTrail(
      'local-1',
      'Greenport Community Forest',
      'Greenport, NY',
      'https://images.unsplash.com/photo-1591815302525-756a9bcc3425?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'easy',
      [-72.3629, 41.1037]
    ),
    length: 3.4,
    elevation: 150,
    elevation_gain: 80,
    tags: ['local', 'forest', 'easy', 'family-friendly'],
    strainTags: ['Forest Green', 'Nature Walk'],
    description: 'A gentle trail through the local community forest. Perfect for a quick morning hike or evening stroll with your dog.',
  },
  {
    ...createBaseTrail(
      'local-2',
      'Lakeside Trail',
      'Crystal Lake, IL',
      'https://images.unsplash.com/photo-1544714042-5dc4f6a3c4ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'easy',
      [-88.3434, 42.2411]
    ),
    length: 2.8,
    elevation: 50,
    elevation_gain: 20,
    tags: ['local', 'lake', 'flat', 'accessible'],
    description: 'A flat, accessible trail that circles Crystal Lake. Great for bird watching and enjoying sunset views over the water.',
  },
  {
    ...createBaseTrail(
      'local-3',
      'Hill Valley Park Trail',
      'Hill Valley, CA',
      'https://images.unsplash.com/photo-1565019001609-8d9e4e062538?ixlib=rb-1.2.1&auto=format&fit=crop&w=1347&q=80',
      'moderate',
      [-118.3417, 34.0900]
    ),
    length: 4.2,
    elevation: 350,
    elevation_gain: 200,
    tags: ['local', 'hills', 'views', 'wildflowers'],
    strainTags: ['Valley Sunset', 'Hill Climber'],
    description: 'A moderately challenging trail with several short but steep climbs. Beautiful wildflower displays in spring.',
  },
  {
    ...createBaseTrail(
      'local-4',
      'Riverside Walking Path',
      'Riverdale, OR',
      'https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1334&q=80',
      'easy',
      [-122.6762, 45.5231]
    ),
    length: 1.5,
    elevation: 20,
    elevation_gain: 10,
    tags: ['local', 'river', 'walking', 'paved'],
    strainTags: ['River Rush', 'Gentle Stream'],
    description: 'A short, paved walking path along the river. Wheelchair accessible and popular with local families and joggers.',
  }
];
