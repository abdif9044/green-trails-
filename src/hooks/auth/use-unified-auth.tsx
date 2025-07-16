import * as React from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UnifiedAuthService, AuthResult, SignUpData } from '@/services/auth/unified-auth-service';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  guestMode: boolean;
}

export interface UnifiedAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isInitialized: boolean;
  guestMode: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (signUpData: SignUpData) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  signInWithSocial: (options: { provider: 'google' | 'apple' }) => Promise<AuthResult>;
  verifyAge: (birthYear: string) => Promise<AuthResult & { age?: number }>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updatePassword: (password: string) => Promise<AuthResult>;
  enableGuestMode: () => void;
  exitGuestMode: () => void;
}

const UnifiedAuthContext = React.createContext<UnifiedAuthContextType | undefined>(undefined);

interface UnifiedAuthProviderProps {
  children: React.ReactNode;
}

export const UnifiedAuthProvider: React.FC<UnifiedAuthProviderProps> = ({ children }) => {
  const [state, setState] = React.useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    initialized: false,
    guestMode: false
  });

  React.useEffect(() => {
    let mounted = true;
    let subscription: { unsubscribe: () => void } | null = null;

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting initial session:', error);
        }

        setState(prevState => ({
          ...prevState,
          session: initialSession,
          user: initialSession?.user || null,
          loading: false,
          initialized: true
        }));

        subscription = supabase.auth.onAuthStateChange((event, currentSession) => {
          if (!mounted) return;
          
          console.log(`Auth state change: ${event}`, currentSession?.user?.email || 'No user');
          setState(prevState => ({
            ...prevState,
            session: currentSession,
            user: currentSession?.user || null,
            loading: false
          }));
        }).data.subscription;
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setState(prevState => ({
            ...prevState,
            loading: false,
            initialized: true
          }));
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
  }, []);

  const enableGuestMode = () => {
    setState(prev => ({ ...prev, guestMode: true }));
  };

  const exitGuestMode = () => {
    setState(prev => ({ ...prev, guestMode: false }));
  };

  const signInWithSocial = (options: { provider: 'google' | 'apple' }) => {
    return UnifiedAuthService.signInWithSocial(options);
  };

  const value: UnifiedAuthContextType = {
    user: state.user,
    session: state.session,
    loading: state.loading,
    isInitialized: state.initialized,
    guestMode: state.guestMode,
    signIn: UnifiedAuthService.signIn,
    signUp: UnifiedAuthService.signUp,
    signOut: UnifiedAuthService.signOut,
    signInWithSocial,
    verifyAge: UnifiedAuthService.verifyAge,
    resetPassword: UnifiedAuthService.resetPassword,
    updatePassword: UnifiedAuthService.updatePassword,
    enableGuestMode,
    exitGuestMode,
  };

  return (
    <UnifiedAuthContext.Provider value={value}>
      {children}
    </UnifiedAuthContext.Provider>
  );
};

export const useUnifiedAuth = (): UnifiedAuthContextType => {
  const context = React.useContext(UnifiedAuthContext);
  if (context === undefined) {
    throw new Error('useUnifiedAuth must be used within a UnifiedAuthProvider');
  }
  return context;
};