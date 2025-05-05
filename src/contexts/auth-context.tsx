
import React, { createContext } from 'react';
import { Session, User } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signUp: (email: string, password: string, metadata?: object) => Promise<{ success: boolean; message?: string }>;
  signOut: () => Promise<{ success: boolean; message?: string }>;
  verifyAge: (birthdate: Date) => Promise<boolean>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; message?: string }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
