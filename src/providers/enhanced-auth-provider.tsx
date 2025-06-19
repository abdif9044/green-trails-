
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedAuthService } from '@/services/auth/enhanced-auth-service';
import { SecurityManager } from '@/services/security/security-manager';
import { ensureReactReady } from '@/utils/react-safety';

interface EnhancedAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isInitialized: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, metadata?: object) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  verifyAge: (birthYear: string) => Promise<{ success: boolean; error?: string; age?: number; isVerified?: boolean }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
}

const EnhancedAuthContext = createContext<EnhancedAuthContextType | undefined>(undefined);

export const useEnhancedAuth = () => {
  const context = useContext(EnhancedAuthContext);
  if (context === undefined) {
    throw new Error('useEnhancedAuth must be used within an EnhancedAuthProvider');
  }
  return context;
};

export const EnhancedAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Safety check for React readiness
  if (!ensureReactReady()) {
    console.warn('EnhancedAuthProvider: React not ready, rendering children without auth context');
    return <>{children}</>;
  }

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;
    let subscription: { unsubscribe: () => void } | null = null;

    const initializeAuth = async () => {
      try {
        // Set up auth state listener FIRST
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;

            console.log('Auth state change:', event, session?.user?.id);

            setSession(session);
            setUser(session?.user ?? null);

            // Log auth state changes securely
            if (event === 'SIGNED_IN' && session?.user) {
              setTimeout(() => {
                SecurityManager.logSecurityEvent({
                  event_type: 'auth_state_change',
                  user_id: session.user.id,
                  metadata: { event },
                  severity: 'low'
                }).catch(console.error);
              }, 0);
            } else if (event === 'SIGNED_OUT') {
              setTimeout(() => {
                SecurityManager.logSecurityEvent({
                  event_type: 'auth_state_change',
                  metadata: { event },
                  severity: 'low'
                }).catch(console.error);
              }, 0);
            }

            if (!isInitialized) {
              setIsInitialized(true);
              setLoading(false);
            }
          }
        );

        subscription = authSubscription;

        // THEN check for existing session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (mounted) {
          console.log('Initial session:', currentSession?.user?.id);
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setIsInitialized(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setIsInitialized(true);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []); // Remove isInitialized dependency to prevent re-initialization

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await EnhancedAuthService.secureSignIn(email, password);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: object) => {
    setLoading(true);
    try {
      const result = await EnhancedAuthService.secureSignUp(email, password, metadata);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await SecurityManager.logSecurityEvent({
        event_type: 'signout_attempt',
        user_id: user?.id,
        severity: 'low'
      });

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        await SecurityManager.logSecurityEvent({
          event_type: 'signout_failed',
          user_id: user?.id,
          metadata: { error: error.message },
          severity: 'medium'
        });
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during sign out';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const verifyAge = async (birthYear: string) => {
    return await EnhancedAuthService.secureAgeVerification(birthYear);
  };

  const resetPassword = async (email: string) => {
    return await EnhancedAuthService.securePasswordReset(email);
  };

  const updatePassword = async (password: string) => {
    return await EnhancedAuthService.secureUpdatePassword(password);
  };

  const value = React.useMemo(() => ({
    user,
    session,
    loading,
    isInitialized,
    signIn,
    signUp,
    signOut,
    verifyAge,
    resetPassword,
    updatePassword,
  }), [user, session, loading, isInitialized]);

  return (
    <EnhancedAuthContext.Provider value={value}>
      {children}
    </EnhancedAuthContext.Provider>
  );
};
