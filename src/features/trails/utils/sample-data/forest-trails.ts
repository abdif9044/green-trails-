
import { Trail } from '@/types/trails';
import { createBaseTrail, createGeoJsonLineString } from './trail-types';

// Forest and woodland trails
export const forestTrails: Trail[] = [
  {
    ...createBaseTrail(
      "1",
      "Emerald Forest Trail",
      "Washington, USA",
      "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=1000&auto=format&fit=crop",
      "easy",
      [-122.3321, 47.6062]
    ),
    length: 3.5,
    elevation: 250,
    elevation_gain: 120,
    tags: ["forest", "waterfall", "family-friendly"],
    geojson: createGeoJsonLineString([
      [-122.3321, 47.6062],
      [-122.3301, 47.6082],
      [-122.3281, 47.6102],
      [-122.3261, 47.6122]
    ]),
    description: "A lush green trail through old-growth forests with small waterfalls along the route."
  },
  {
    ...createBaseTrail(
      "3",
      "Cedar Loop",
      "Oregon, USA",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1000&auto=format&fit=crop",
      "moderate",
      [-122.6765, 45.5231]
    ),
    length: 4.7,
    elevation: 450,
    elevation_gain: 280,
    tags: ["forest", "loop", "scenic"],
    geojson: createGeoJsonLineString([
      [-122.6765, 45.5231],
      [-122.6785, 45.5251],
      [-122.6805, 45.5271],
      [-122.6825, 45.5291],
      [-122.6805, 45.5311],
      [-122.6785, 45.5331],
      [-122.6765, 45.5231]
    ]),
    description: "A beautiful loop trail through cedar forests with plenty of shade and bird watching opportunities."
  },
  {
    ...createBaseTrail(
      "7",
      "Redwood Forest Path",
      "California, USA",
      "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1000&auto=format&fit=crop",
      "easy",
      [-124.0046, 41.2132]
    ),
    length: 2.8,
    elevation: 150,
    elevation_gain: 90,
    tags: ["forest", "redwoods", "shaded"],
    description: "Walk among the towering redwoods on this peaceful forest trail with dappled sunlight."
  }
];
