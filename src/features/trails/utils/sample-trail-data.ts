
import { Trail } from '@/types/trails';

// Create sample trails data for development/fallback
export const createSampleTrails = (): Trail[] => {
  return [
    {
      id: "1",
      name: "Emerald Forest Trail",
      location: "Washington, USA",
      imageUrl: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=1000&auto=format&fit=crop",
      difficulty: "easy",
      length: 3.5,
      elevation: 250,
      tags: ["forest", "waterfall", "family-friendly"],
      likes: 124,
      isAgeRestricted: false
    },
    {
      id: "2",
      name: "Mountain Ridge Path",
      location: "Colorado, USA",
      imageUrl: "https://images.unsplash.com/photo-1454982523318-4b6396f39d3a?q=80&w=1000&auto=format&fit=crop",
      difficulty: "hard",
      length: 8.2,
      elevation: 1200,
      tags: ["mountain", "views", "challenging"],
      likes: 87,
      isAgeRestricted: false
    },
    {
      id: "3",
      name: "Cedar Loop",
      location: "Oregon, USA",
      imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1000&auto=format&fit=crop",
      difficulty: "moderate",
      length: 4.7,
      elevation: 450,
      tags: ["forest", "loop", "scenic"],
      likes: 56,
      isAgeRestricted: false
    },
    {
      id: "4",
      name: "Sunset Canyon",
      location: "Arizona, USA",
      imageUrl: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=1000&auto=format&fit=crop",
      difficulty: "moderate",
      length: 6.3,
      elevation: 820,
      tags: ["desert", "canyon", "sunset-views"],
      likes: 93,
      isAgeRestricted: false
    },
    {
      id: "5",
      name: "Green Valley Trek",
      location: "California, USA",
      imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop",
      difficulty: "expert",
      length: 12.5,
      elevation: 2100,
      tags: ["mountain", "forest", "challenging"],
      likes: 145,
      isAgeRestricted: true,
      strainTags: [
        {
          name: "Blue Dream",
          type: "hybrid",
          effects: ["relaxed", "creative", "uplifted"],
          description: "A popular strain known for its balanced effects"
        }
      ]
    }
  ];
};
