
export type TrailDifficulty = 'easy' | 'moderate' | 'hard' | 'expert';

export interface StrainTag {
  name: string;
  type: 'sativa' | 'indica' | 'hybrid';
  effects: string[];
  description?: string;
}

export interface Trail {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  difficulty: TrailDifficulty;
  length: number;
  elevation: number;
  tags: string[];
  likes: number;
  coordinates?: [number, number]; // [longitude, latitude]
  strainTags?: string[] | StrainTag[];
  isAgeRestricted: boolean;
  description?: string;
}

export interface TrailFilters {
  searchQuery?: string;
  difficulty?: string | null;
  lengthRange?: [number, number];
  tags?: string[];
  strainTypes?: ('sativa' | 'indica' | 'hybrid')[];
  showAgeRestricted?: boolean;
}
