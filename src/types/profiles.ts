
import { Database } from '@/integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export interface ProfileWithSocial extends Profile {
  follower_count?: number;
  following_count?: number;
  trail_count?: number;
  twitter_url?: string;
  instagram_url?: string;
}
