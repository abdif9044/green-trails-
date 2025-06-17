
import { supabase } from '@/integrations/supabase/client';

export interface TrailTag {
  id: string;
  trail_id: string;
  tag: string;
  created_at: string;
}

export const addTrailTags = async (trailId: string, tags: string[]) => {
  try {
    // Since trail_tags table doesn't exist, log warning and return empty array
    console.warn('Trail tags table does not exist, unable to add tags');
    return [];
  } catch (error) {
    console.error('Error in addTrailTags:', error);
    return [];
  }
};

export const getTrailTags = async (trailId: string) => {
  try {
    // Since trail_tags table doesn't exist, return empty array
    console.warn('Trail tags table does not exist, returning empty tags');
    return [];
  } catch (error) {
    console.error('Error in getTrailTags:', error);
    return [];
  }
};

export const getAllTags = async () => {
  try {
    // Since trail_tags table doesn't exist, return empty array
    console.warn('Trail tags table does not exist, returning empty tags');
    return [];
  } catch (error) {
    console.error('Error in getAllTags:', error);
    return [];
  }
};
