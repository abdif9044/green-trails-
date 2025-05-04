
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
      isAgeRestricted: false,
      coordinates: [-122.3321, 47.6062], // Seattle coordinates
      geojson: {
        type: "FeatureCollection",
        features: [{
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              [-122.3321, 47.6062],
              [-122.3301, 47.6082],
              [-122.3281, 47.6102],
              [-122.3261, 47.6122]
            ]
          }
        }]
      }
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
      isAgeRestricted: false,
      coordinates: [-105.2705, 40.0150], // Boulder coordinates
      geojson: {
        type: "FeatureCollection",
        features: [{
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              [-105.2705, 40.0150],
              [-105.2755, 40.0180],
              [-105.2805, 40.0210],
              [-105.2855, 40.0240]
            ]
          }
        }]
      }
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
      isAgeRestricted: false,
      coordinates: [-122.6765, 45.5231], // Portland coordinates
      geojson: {
        type: "FeatureCollection",
        features: [{
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              [-122.6765, 45.5231],
              [-122.6785, 45.5251],
              [-122.6805, 45.5271],
              [-122.6825, 45.5291],
              [-122.6805, 45.5311],
              [-122.6785, 45.5331],
              [-122.6765, 45.5231]
            ]
          }
        }]
      }
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
      isAgeRestricted: false,
      coordinates: [-111.7988, 33.6897], // Scottsdale coordinates
      geojson: null
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
      coordinates: [-119.5383, 37.8651], // Yosemite coordinates
      strainTags: [
        {
          name: "Blue Dream",
          type: "hybrid",
          effects: ["relaxed", "creative", "uplifted"],
          description: "A popular strain known for its balanced effects"
        }
      ],
      geojson: null
    },
    {
      id: "6",
      name: "Coastal Bluff Trail",
      location: "California, USA",
      imageUrl: "https://images.unsplash.com/photo-1522057384400-681b421cfebc?q=80&w=1000&auto=format&fit=crop",
      difficulty: "moderate",
      length: 5.4,
      elevation: 320,
      tags: ["coastal", "views", "ocean"],
      likes: 178,
      isAgeRestricted: false,
      coordinates: [-122.4194, 37.7749], // San Francisco coordinates
      geojson: {
        type: "FeatureCollection",
        features: [{
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              [-122.4194, 37.7749],
              [-122.4214, 37.7769],
              [-122.4234, 37.7789],
              [-122.4254, 37.7809]
            ]
          }
        }]
      }
    },
    {
      id: "7",
      name: "Redwood Forest Path",
      location: "California, USA",
      imageUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1000&auto=format&fit=crop",
      difficulty: "easy",
      length: 2.8,
      elevation: 150,
      tags: ["forest", "redwoods", "shaded"],
      likes: 103,
      isAgeRestricted: false,
      coordinates: [-124.0046, 41.2132], // Redwood National Park coordinates
      geojson: null
    },
    {
      id: "8",
      name: "Alpine Meadow Trail",
      location: "Washington, USA",
      imageUrl: "https://images.unsplash.com/photo-1520962922320-2038eebab146?q=80&w=1000&auto=format&fit=crop",
      difficulty: "moderate",
      length: 7.1,
      elevation: 980,
      tags: ["alpine", "meadow", "wildflowers"],
      likes: 67,
      isAgeRestricted: false,
      coordinates: [-121.6423, 46.7865], // Mount Rainier coordinates
      geojson: null
    },
    {
      id: "9",
      name: "Desert Oasis Loop",
      location: "Nevada, USA",
      imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop",
      difficulty: "hard",
      length: 9.3,
      elevation: 1450,
      tags: ["desert", "oasis", "hot"],
      likes: 42,
      isAgeRestricted: true,
      coordinates: [-115.1398, 36.1699], // Las Vegas area coordinates
      strainTags: [
        {
          name: "OG Kush",
          type: "indica",
          effects: ["relaxed", "sleepy", "euphoric"],
          description: "Perfect for desert evening hikes when the temperature drops"
        }
      ],
      geojson: null
    },
    {
      id: "10",
      name: "Glacier View Trail",
      location: "Alaska, USA",
      imageUrl: "https://images.unsplash.com/photo-1515705576963-95cad62945b6?q=80&w=1000&auto=format&fit=crop",
      difficulty: "expert",
      length: 15.7,
      elevation: 3200,
      tags: ["glacier", "mountain", "challenging"],
      likes: 29,
      isAgeRestricted: false,
      coordinates: [-149.6500, 61.2181], // Near Anchorage coordinates
      geojson: null
    }
  ];
};
