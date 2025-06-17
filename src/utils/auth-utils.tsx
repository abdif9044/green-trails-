
import { User } from '@supabase/supabase-js';

export const getUserDisplayName = (user: User | null): string => {
  if (!user) return 'Anonymous';
  
  // Try to get name from user metadata
  const fullName = user.user_metadata?.full_name;
  if (fullName) return fullName;
  
  // Fallback to email
  return user.email || 'User';
};

export const isEmailVerified = (user: User | null): boolean => {
  return user?.email_confirmed_at != null;
};

export const getUserAvatarUrl = (user: User | null): string | null => {
  return user?.user_metadata?.avatar_url || null;
};
