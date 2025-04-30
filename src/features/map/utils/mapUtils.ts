
import mapboxgl from 'mapbox-gl';
import { supabase } from '@/integrations/supabase/client';
import { TrailDifficulty } from '@/types/trails';

export const getMapboxToken = async () => {
  const { data: { token }, error } = await supabase.functions.invoke('get-mapbox-token');
  if (error) throw error;
  return token;
};

export const getTrailColor = (difficulty: string = 'moderate'): string => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return '#4ade80'; // green
    case 'moderate':
      return '#fbbf24'; // amber
    case 'hard':
      return '#f87171'; // red
    case 'expert':
      return '#8b5cf6'; // purple
    default:
      return '#60a5fa'; // blue
  }
};
