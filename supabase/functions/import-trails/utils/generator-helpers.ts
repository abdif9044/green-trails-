// Utility functions for generating trail data

export function randomDifficulty(): string {
  const difficulties = ['easy', 'moderate', 'hard', 'expert'];
  const weights = [0.3, 0.4, 0.2, 0.1]; // 30% easy, 40% moderate, 20% hard, 10% expert
  
  return weightedRandom(difficulties, weights);
}

export function randomSurface(): string {
  const surfaces = ['dirt', 'gravel', 'paved', 'rocky', 'sand', 'mixed', 'boardwalk'];
  const weights = [0.4, 0.25, 0.1, 0.15, 0.05, 0.03, 0.02];
  
  return weightedRandom(surfaces, weights);
}

export function randomTrailType(): string {
  const trailTypes = ['loop', 'out-and-back', 'point-to-point', 'network', 'lollipop'];
  const weights = [0.35, 0.4, 0.15, 0.05, 0.05];
  
  return weightedRandom(trailTypes, weights);
}

export function generateTrailPath(startLat: number, startLng: number, numPoints: number): number[][] {
  const coordinates = [[startLng, startLat]];
  let currentLat = startLat;
  let currentLng = startLng;
  
  // Create a more natural path by maintaining a general direction with some variance
  const latScale = 0.005 + (Math.random() * 0.01);
  const lngScale = 0.005 + (Math.random() * 0.01);
  
  // Determine if this is a loop trail (45% chance)
  const isLoop = Math.random() < 0.45;
  
  // For loops, we'll plan a route that eventually returns near the start
  let generalLatDir = Math.random() > 0.5 ? 1 : -1;
  let generalLngDir = Math.random() > 0.5 ? 1 : -1;
  let directionChanges = 0;
  
  for (let p = 0; p < numPoints; p++) {
    // Occasionally adjust the general direction to create curves
    if (Math.random() < 0.2) {
      generalLatDir *= (Math.random() > 0.7 ? -1 : 1);
      directionChanges++;
    }
    if (Math.random() < 0.2) {
      generalLngDir *= (Math.random() > 0.7 ? -1 : 1);
      directionChanges++;
    }
    
    // For loops, start heading back to the origin after halfway
    if (isLoop && p > numPoints * 0.6) {
      // Calculate direction to return to start
      const latDiff = startLat - currentLat;
      const lngDiff = startLng - currentLng;
      
      generalLatDir = latDiff > 0 ? 1 : -1;
      generalLngDir = lngDiff > 0 ? 1 : -1;
    }
    
    // Add some randomness but keep the general direction
    const latChange = ((Math.random() * 0.8) + 0.2) * generalLatDir * latScale;
    const lngChange = ((Math.random() * 0.8) + 0.2) * generalLngDir * lngScale;
    
    currentLat += latChange;
    currentLng += lngChange;
    
    coordinates.push([currentLng, currentLat]);
  }
  
  return coordinates;
}

function weightedRandom(items: string[], weights: number[]): string {
  const random = Math.random();
  let cumulativeWeight = 0;
  
  for (let i = 0; i < items.length; i++) {
    cumulativeWeight += weights[i];
    if (random < cumulativeWeight) {
      return items[i];
    }
  }
  
  return items[0]; // Default fallback
}
