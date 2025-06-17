
export interface UserPreferences {
  preferred_difficulty?: string;
  preferred_length_range?: [number, number];
  favorite_tags?: string[];
  location_preferences?: string[];
  time_of_day?: string;
}

export interface TrailInteraction {
  trail_id: string;
  interaction_type: 'view' | 'like' | 'comment' | 'hike';
  created_at: string;
}

export interface TrailScore {
  trail_id: string;
  score: number;
}
