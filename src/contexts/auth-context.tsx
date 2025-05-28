
import React, { createContext } from 'react';
import { Session, User } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isInitialized: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message?: string; user?: User }>;
  signUp: (email: string, password: string, metadata?: object) => Promise<{ success: boolean; message?: string; user?: User }>;
  signOut: () => Promise<{ success: boolean; message?: string }>;
  verifyAge: (birthYear: string) => Promise<{ success: boolean; message?: string; age?: number }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; message?: string }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
