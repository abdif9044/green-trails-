
export interface Profile {
  id: string;
  full_name?: string;
  username?: string;
  bio?: string;
  avatar_url?: string;
  website_url?: string;
  email?: string;
  is_admin?: boolean;
  is_age_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileWithSocial extends Profile {
  followers_count?: number;
  following_count?: number;
  trails_count?: number;
  is_following?: boolean;
  is_followed_by?: boolean;
  twitter_url?: string;
  instagram_url?: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  preferred_difficulty?: 'easy' | 'moderate' | 'hard';
  preferred_length_range?: [number, number];
  favorite_tags?: string[];
  location_preferences?: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  time_of_day?: 'morning' | 'afternoon' | 'evening';
  created_at: string;
  updated_at: string;
}

export interface UserMemory {
  id: string;
  user_id: string;
  memory_type: 'preference' | 'fact' | 'interaction' | 'context';
  content: string;
  metadata?: any;
  importance_score: number;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}
