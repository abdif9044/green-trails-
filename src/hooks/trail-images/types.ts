
// Common types used across trail image hooks

export interface TrailImage {
  id: string;
  trail_id: string;
  image_path: string;
  full_image_url?: string; // Added for convenience
  is_primary: boolean;
  caption?: string;
  created_at: string;
  user_id: string;
}
