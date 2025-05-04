
import { Trail } from '@/types/trails';
import { createBaseTrail, createGeoJsonLineString } from './trail-types';

// Urban and city trails
export const urbanTrails: Trail[] = [
  {
    ...createBaseTrail(
      "3",
      "Silver Lake Loop",
      "Rochester, MN",
      "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      "easy",
      [-92.4570, 44.0241]
    ),
    length: 2.1,
    elevation: 50,
    elevation_gain: 30,
    tags: ["urban", "lake", "paved"],
    description: "This paved urban trail loops around Silver Lake, offering views of the Rochester skyline and abundant waterfowl. Perfect for casual walks, jogging, or cycling."
  },
  {
    ...createBaseTrail(
      "5",
      "Bear Creek Trail",
      "Rochester, MN",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1000&auto=format&fit=crop",
      "easy",
      [-92.4628, 44.0220]
    ),
    length: 6.5,
    elevation: 120,
    elevation_gain: 75,
    tags: ["creek", "urban", "paved"],
    description: "The Bear Creek Trail connects several Rochester neighborhoods, following the creek through urban green spaces. It's perfect for cycling, jogging, or leisurely walks close to the city center."
  },
  {
    ...createBaseTrail(
      "6",
      "Coastal Bluff Trail",
      "California, USA",
      "https://images.unsplash.com/photo-1522057384400-681b421cfebc?q=80&w=1000&auto=format&fit=crop",
      "moderate",
      [-122.4194, 37.7749]
    ),
    length: 5.4,
    elevation: 320,
    elevation_gain: 180,
    tags: ["coastal", "views", "ocean"],
    geojson: createGeoJsonLineString([
      [-122.4194, 37.7749],
      [-122.4214, 37.7769],
      [-122.4234, 37.7789],
      [-122.4254, 37.7809]
    ]),
    description: "Stunning coastal views along the California shoreline with spectacular ocean panoramas."
  }
];
