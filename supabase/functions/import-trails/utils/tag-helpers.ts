
import { TrailData } from "../types.ts";

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
