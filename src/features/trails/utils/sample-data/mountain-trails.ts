
import { Trail } from '@/types/trails';
import { createBaseTrail, createGeoJsonLineString } from './trail-types';

// Mountain and challenging trails
export const mountainTrails: Trail[] = [
  {
    ...createBaseTrail(
      "2",
      "Mountain Ridge Path",
      "Colorado, USA",
      "https://images.unsplash.com/photo-1454982523318-4b6396f39d3a?q=80&w=1000&auto=format&fit=crop",
      "hard",
      [-105.2705, 40.0150]
    ),
    length: 8.2,
    elevation: 1200,
    elevation_gain: 750,
    tags: ["mountain", "views", "challenging"],
    geojson: createGeoJsonLineString([
      [-105.2705, 40.0150],
      [-105.2755, 40.0180],
      [-105.2805, 40.0210],
      [-105.2855, 40.0240]
    ]),
    description: "A challenging mountain trail with breathtaking views of the Colorado Rockies."
  },
  {
    ...createBaseTrail(
      "5",
      "Green Valley Trek",
      "California, USA",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop",
      "expert",
      [-119.5383, 37.8651]
    ),
    length: 12.5,
    elevation: 2100,
    elevation_gain: 1200,
    tags: ["mountain", "forest", "challenging"],
    strainTags: [
      {
        name: "Blue Dream",
        type: "hybrid",
        effects: ["relaxed", "creative", "uplifted"],
        description: "A popular strain known for its balanced effects"
      }
    ],
    description: "An expert-level trail through Yosemite's high country with challenging terrain and amazing views."
  },
  {
    ...createBaseTrail(
      "10",
      "Glacier View Trail",
      "Alaska, USA",
      "https://images.unsplash.com/photo-1515705576963-95cad62945b6?q=80&w=1000&auto=format&fit=crop",
      "expert",
      [-149.6500, 61.2181]
    ),
    length: 15.7,
    elevation: 3200,
    elevation_gain: 1850,
    tags: ["glacier", "mountain", "challenging"],
    description: "An epic Alaskan adventure with stunning glacier views and challenging alpine terrain."
  }
];
