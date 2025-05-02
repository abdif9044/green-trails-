
import { StrainTag, TrailData } from "../types.ts";

export async function addStrainTagsToTrail(supabase: any, trailId: string, strainTags: StrainTag[]) {
  for (const tag of strainTags) {
    try {
      // First ensure the strain tag exists in the tags table
      const { data: tagData, error: tagError } = await supabase
        .from('tags')
        .upsert({
          name: tag.name,
          tag_type: 'strain',
          details: {
            type: tag.type,
            effects: tag.effects,
            description: tag.description
          }
        }, { onConflict: 'name', returning: true })
        .select('id')
        .single();
      
      if (tagError || !tagData) {
        console.error('Error upserting strain tag:', tagError);
        continue;
      }
      
      // Then add the tag to the trail
      await supabase
        .from('trail_tags')
        .upsert({
          trail_id: trailId,
          tag_id: tagData.id,
          is_strain_tag: true
        }, { onConflict: ['trail_id', 'tag_id'] });
        
    } catch (error) {
      console.error('Error adding strain tag to trail:', error);
    }
  }
}

export async function addTagsToTrail(supabase: any, trailId: string, tags: string[]) {
  for (const tagName of tags) {
    try {
      // First ensure the tag exists in the tags table
      const { data: tagData, error: tagError } = await supabase
        .from('tags')
        .upsert({
          name: tagName,
          tag_type: 'regular'
        }, { onConflict: 'name', returning: true })
        .select('id')
        .single();
      
      if (tagError || !tagData) {
        console.error('Error upserting tag:', tagError);
        continue;
      }
      
      // Then add the tag to the trail
      await supabase
        .from('trail_tags')
        .upsert({
          trail_id: trailId,
          tag_id: tagData.id,
          is_strain_tag: false
        }, { onConflict: ['trail_id', 'tag_id'] });
        
    } catch (error) {
      console.error('Error adding tag to trail:', error);
    }
  }
}

export function generateRandomTags(trail: TrailData): string[] {
  const allTags = [
    'Hiking', 'Walking', 'Mountain Biking', 'Kid Friendly', 'Dog Friendly',
    'Scenic Views', 'Waterfall', 'Lake', 'River', 'Wildlife',
    'Wildflowers', 'Fall Colors', 'Forest', 'Mountain', 'Desert',
    'Beach', 'Rocky', 'Bird Watching', 'Camping', 'Backpacking',
    'Fishing', 'Horseback Riding', 'ADA Accessible', 'Historical', 'Cave',
    'Hot Springs', 'Photography', 'Stargazing', 'Snow', 'Waterfront'
  ];
  
  // Select 2-6 random tags
  const numTags = 2 + Math.floor(Math.random() * 5);
  const tags = [];
  
  // Always add tags based on trail properties
  if (trail.surface) tags.push(trail.surface.charAt(0).toUpperCase() + trail.surface.slice(1));
  if (trail.trail_type) {
    const formattedType = trail.trail_type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    tags.push(formattedType);
  }
  
  // Add random tags from the pool
  while (tags.length < numTags) {
    const randomTag = allTags[Math.floor(Math.random() * allTags.length)];
    if (!tags.includes(randomTag)) {
      tags.push(randomTag);
    }
  }
  
  return tags;
}

export function generateRandomStrainTags(): StrainTag[] {
  // Common cannabis strain names
  const strainNames = [
    'Blue Dream', 'OG Kush', 'Green Crack', 'Sour Diesel', 'Purple Haze',
    'White Widow', 'Jack Herer', 'Pineapple Express', 'Girl Scout Cookies', 'Northern Lights',
    'Granddaddy Purple', 'Durban Poison', 'AK-47', 'Strawberry Cough', 'Bubba Kush',
    'Trainwreck', 'Amnesia Haze', 'Cherry Pie', 'Blueberry', 'Gorilla Glue',
    'Skywalker OG', 'Tangie', 'G13', 'Super Lemon Haze', 'Golden Goat'
  ];
  
  // Strain types
  const strainTypes = ['sativa', 'indica', 'hybrid'];
  
  // Possible effects
  const effects = [
    'Relaxed', 'Happy', 'Euphoric', 'Uplifted', 'Creative',
    'Energetic', 'Focused', 'Tingly', 'Giggly', 'Hungry',
    'Sleepy', 'Talkative', 'Pain Relief', 'Stress Relief', 'Anxiety Relief'
  ];
  
  // Generate 1-3 strain tags
  const numStrains = 1 + Math.floor(Math.random() * 2);
  const strains: StrainTag[] = [];
  
  for (let i = 0; i < numStrains; i++) {
    const nameIndex = Math.floor(Math.random() * strainNames.length);
    const name = strainNames[nameIndex];
    
    // Don't duplicate strain names
    if (strains.some(s => s.name === name)) continue;
    
    const typeIndex = Math.floor(Math.random() * strainTypes.length);
    const type = strainTypes[typeIndex];
    
    // Generate 2-4 random effects
    const numEffects = 2 + Math.floor(Math.random() * 3);
    const strainEffects: string[] = [];
    while (strainEffects.length < numEffects) {
      const effectIndex = Math.floor(Math.random() * effects.length);
      const effect = effects[effectIndex];
      if (!strainEffects.includes(effect)) {
        strainEffects.push(effect);
      }
    }
    
    const descriptions = [
      `A ${type} strain known for its ${strainEffects.join(' and ')} effects.`,
      `This popular ${type} offers a balance of ${strainEffects.join(', ')}.`,
      `${name} is a classic ${type} strain that provides ${strainEffects.join(' and ')}.`
    ];
    
    strains.push({
      name,
      type,
      effects: strainEffects,
      description: descriptions[Math.floor(Math.random() * descriptions.length)]
    });
  }
  
  return strains;
}
