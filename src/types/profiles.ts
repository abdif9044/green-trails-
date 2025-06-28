
import { Profile as BaseProfile } from '@/hooks/use-profile';

// Extend the base profile with additional social properties
export interface ProfileWithSocial extends BaseProfile {
  website_url?: string | null;
  twitter_url?: string | null;
  instagram_url?: string | null;
}
