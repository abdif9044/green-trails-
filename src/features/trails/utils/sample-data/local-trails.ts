
import { Trail } from '@/types/trails';
import { createBaseTrail } from './trail-types';

// Local Rochester trails
export const localTrails: Trail[] = [
  {
    ...createBaseTrail(
      "1",
      "Quarry Hills Park Trail",
      "Rochester, MN",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
      "moderate",
      [-92.4631, 44.0553]
    ),
    length: 4.5,
    elevation: 320,
    elevation_gain: 200,
    tags: ["quarry", "woodland", "scenic"],
    strainTags: ["Blue Dream", "Northern Lights"],
    description: "Quarry Hills Park features scenic hiking trails through oak savanna and restored prairie. With beautiful views of Rochester and extensive trail systems for hiking and mountain biking, it's a local favorite."
  },
  {
    ...createBaseTrail(
      "2",
      "Chester Woods Trail",
      "Rochester, MN",
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
      "easy",
      [-92.3688, 44.0461]
    ),
    length: 3.2,
    elevation: 150,
    elevation_gain: 80,
    tags: ["lake", "family-friendly", "wildlife"],
    description: "A beautiful lakeside trail circling Chester Lake with abundant wildlife viewing opportunities. Great for family walks and bird watching through all seasons."
  },
  {
    ...createBaseTrail(
      "4",
      "Cascade Lake Trail",
      "Rochester, MN",
      "https://images.unsplash.com/photo-1476611338391-6f395a0b9885?q=80&w=1000&auto=format&fit=crop",
      "easy",
      [-92.5042, 44.0366]
    ),
    length: 2.8,
    elevation: 80,
    elevation_gain: 40,
    tags: ["lake", "accessible", "birding"],
    strainTags: ["Granddaddy Purple"],
    description: "A peaceful path around Cascade Lake with excellent birdwatching opportunities. This accessible trail features beautiful wetlands and prairie restoration areas."
  },
  {
    ...createBaseTrail(
      "6",
      "Boundary Waters Trail",
      "Ely, MN",
      "https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=1000&auto=format&fit=crop",
      "hard",
      [-91.8168, 47.9951]
    ),
    length: 8.4,
    elevation: 580,
    elevation_gain: 350,
    tags: ["wilderness", "lake", "remote"],
    strainTags: ["Durban Poison", "Sour Diesel"],
    description: "Experience the pristine wilderness of Northern Minnesota on this trail through the famous Boundary Waters Canoe Area. Features dense forests, crystal-clear lakes, and incredible wildlife viewing opportunities."
  }
];
