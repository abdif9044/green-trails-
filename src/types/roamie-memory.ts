
/**
 * TypeScript interfaces for Roamie's memory system
 */

export interface RoamieContext {
  lastVisitedTrails: string[];
  preferredTrailDifficulty: "easy" | "moderate" | "hard" | null;
  lastSearchTimestamp: string | null;
  favoriteLocations: { id: string; name: string }[];
  recentSearchTerms: string[];
  preferredWeatherConditions: string[];
  lastChatTimestamp: string | null;
  conversationCount: number;
}

export interface MemoryRecord {
  id: string;
  user_id: string;
  memory_key: string;
  memory_value: any;
  created_at: string;
  updated_at: string;
}

export interface MemoryRequest {
  user_id: string;
  memory_key: string;
  memory_value: any;
}

export interface MemoryResponse {
  memory_value: any;
}

export interface MemoryError {
  error: string;
  details?: string;
}

// Default context for new users
export const defaultRoamieContext: RoamieContext = {
  lastVisitedTrails: [],
  preferredTrailDifficulty: null,
  lastSearchTimestamp: null,
  favoriteLocations: [],
  recentSearchTerms: [],
  preferredWeatherConditions: [],
  lastChatTimestamp: null,
  conversationCount: 0,
};
