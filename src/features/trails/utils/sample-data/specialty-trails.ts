
import { Trail } from '@/types/trails';
import { createBaseTrail } from './trail-types';

// Specialty trails (desert, age-restricted, etc.)
export const specialtyTrails: Trail[] = [
  {
    ...createBaseTrail(
      "4",
      "Sunset Canyon",
      "Arizona, USA",
      "https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=1000&auto=format&fit=crop",
      "moderate",
      [-111.7988, 33.6897]
    ),
    length: 6.3,
    elevation: 820,
    elevation_gain: 420,
    tags: ["desert", "canyon", "sunset-views"],
    description: "Experience the magical colors of the desert at sunset in this moderately challenging canyon hike."
  },
  {
    ...createBaseTrail(
      "8",
      "Alpine Meadow Trail",
      "Washington, USA",
      "https://images.unsplash.com/photo-1520962922320-2038eebab146?q=80&w=1000&auto=format&fit=crop",
      "moderate",
      [-121.6423, 46.7865]
    ),
    length: 7.1,
    elevation: 980,
    elevation_gain: 580,
    tags: ["alpine", "meadow", "wildflowers"],
    description: "Wander through beautiful alpine meadows filled with wildflowers during the summer months."
  },
  {
    ...createBaseTrail(
      "9",
      "Desert Oasis Loop",
      "Nevada, USA",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop",
      "hard",
      [-115.1398, 36.1699]
    ),
    length: 9.3,
    elevation: 1450,
    elevation_gain: 890,
    tags: ["desert", "oasis", "hot"],
    strainTags: [
      {
        name: "OG Kush",
        type: "indica",
        effects: ["relaxed", "sleepy", "euphoric"],
        description: "Perfect for desert evening hikes when the temperature drops"
      }
    ],
    description: "A challenging desert hike leading to a hidden oasis - best attempted in cooler months."
  }
];
