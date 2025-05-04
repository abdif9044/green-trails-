
import React, { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthContext } from '@/contexts/auth-context';
import { AuthService } from '@/services/auth';
import { DatabaseSetupService } from '@/services/database/setup-service';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error fetching session:', error);
      }
      
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
        
        // Log auth state changes for security purposes
        if (_event && user?.id !== session?.user.id) {
          DatabaseSetupService.logSecurityEvent('auth_state_change', {
            event: _event,
            user_id: session?.user.id,
            timestamp: new Date().toISOString()
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await AuthService.signIn(email, password);
    if (!result.success) {
      toast({
        title: "Sign in failed",
        description: result.message || "An error occurred during sign in",
        variant: "destructive",
      });
    }
    return result;
  };

  const signUp = async (email: string, password: string, metadata: object = {}) => {
    const result = await AuthService.signUp(email, password, metadata);
    if (result.success) {
      toast({
        title: "Sign up successful",
        description: "Please check your email for verification.",
      });
    } else {
      toast({
        title: "Sign up failed",
        description: result.message || "An error occurred during sign up",
        variant: "destructive",
      });
    }
    return result;
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
    } catch (error) {
      console.error('Exception during sign out:', error);
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
