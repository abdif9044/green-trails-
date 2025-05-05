
import React, { useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthContext } from '@/contexts/auth-context';
import { AuthService } from '@/services/auth';
import { DatabaseSetupService } from '@/services/database/setup-service';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user || null);
        setLoading(false);
        
        // Log auth state changes for security purposes
        if (_event && user?.id !== currentSession?.user?.id) {
          DatabaseSetupService.logSecurityEvent('auth_state_change', {
            event: _event,
            user_id: currentSession?.user?.id,
            timestamp: new Date().toISOString()
          }).catch(console.error);
        }
      }
    );

    // THEN check for existing session
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user || null);
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await AuthService.signIn(email, password);
      if (!result.success) {
        toast({
          title: "Sign in failed",
          description: result.message || "An error occurred during sign in",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign in successful",
          description: "Welcome back to GreenTrails!",
        });
      }
      return result;
    } catch (error) {
      console.error('Exception during sign in:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, message: errorMessage };
    }
  };

  const signUp = async (email: string, password: string, metadata: object = {}) => {
    try {
      const result = await AuthService.signUp(email, password, metadata);
      if (result.success) {
        toast({
          title: "Account created successfully",
          description: "You can now sign in with your credentials",
        });
      } else {
        toast({
          title: "Sign up failed",
          description: result.message || "An error occurred during sign up",
          variant: "destructive",
        });
      }
      return result;
    } catch (error) {
      console.error('Exception during sign up:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, message: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      const result = await AuthService.signOut(user?.id);
      if (!result.success) {
        toast({
          title: "Sign out failed",
          description: result.message || "An error occurred during sign out",
          variant: "destructive",
        });
      }
      return result;
    } catch (error) {
      console.error('Exception during sign out:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: "Sign out failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, message: errorMessage };
    }
  };

  const verifyAge = async (birthdate: Date) => {
    const result = await AuthService.verifyAge(birthdate, user?.id);
    
    if (result) {
      toast({
        title: "Age verification successful",
        description: "Your account has been verified as 21+.",
      });
    } else {
      toast({
        title: "Age verification failed",
        description: "You must be 21 or older to use GreenTrails.",
        variant: "destructive",
      });
    }
    
    return result;
  };

  const resetPassword = async (email: string) => {
    const result = await AuthService.resetPassword(email);
    
    if (result.success) {
      toast({
        title: "Password reset email sent",
        description: "Please check your email to reset your password.",
      });
    } else {
      toast({
        title: "Password reset failed",
        description: result.message || "An error occurred during password reset",
        variant: "destructive",
      });
    }
    
    return result;
  };

  const updatePassword = async (password: string) => {
    const result = await AuthService.updatePassword(password, user?.id);
    
    if (result.success) {
      toast({
        title: "Password updated successfully",
        description: "Your password has been changed.",
      });
    } else {
      toast({
        title: "Password update failed",
        description: result.message || "An error occurred during password update",
        variant: "destructive",
      });
    }
    
    return result;
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    verifyAge,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
