
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from './use-toast';
import { DatabaseSetupService } from '@/services/database/setup-service';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signUp: (email: string, password: string, metadata?: object) => Promise<{ success: boolean; message?: string }>;
  signOut: () => Promise<void>;
  verifyAge: (birthdate: Date) => Promise<boolean>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Error signing in:', error);
        
        // Log failed sign in attempts for security monitoring
        await DatabaseSetupService.logSecurityEvent('failed_login_attempt', { 
          email, 
          error: error.message, 
          timestamp: new Date().toISOString() 
        });
        
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, message: error.message };
      }
      
      // Log successful sign in
      await DatabaseSetupService.logSecurityEvent('successful_login', { 
        user_id: data.user?.id,
        timestamp: new Date().toISOString() 
      });

      return { success: true };
    } catch (error) {
      console.error('Exception during sign in:', error);
      
      if (error instanceof Error) {
        return { success: false, message: error.message };
      }
      return { success: false, message: 'An unknown error occurred' };
    }
  };

  const signUp = async (email: string, password: string, metadata: object = {}) => {
    try {
      // We require users to be 21+
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...metadata,
            signup_timestamp: new Date().toISOString()
          },
        }
      });

      if (error) {
        console.error('Error signing up:', error);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, message: error.message };
      }

      // Log successful registration
      await DatabaseSetupService.logSecurityEvent('user_registration', { 
        user_id: data.user?.id,
        timestamp: new Date().toISOString() 
      });

      toast({
        title: "Sign up successful",
        description: "Please check your email for verification.",
      });

      return { success: true };
    } catch (error) {
      console.error('Exception during sign up:', error);
      
      if (error instanceof Error) {
        return { success: false, message: error.message };
      }
      return { success: false, message: 'An unknown error occurred' };
    }
  };

  const signOut = async () => {
    try {
      // Log the sign out for security audit
      if (user) {
        await DatabaseSetupService.logSecurityEvent('user_signout', { 
          user_id: user.id,
          timestamp: new Date().toISOString() 
        });
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Exception during sign out:', error);
    }
  };

  const verifyAge = async (birthdate: Date) => {
    try {
      const now = new Date();
      const age = now.getFullYear() - birthdate.getFullYear();
      
      // Adjust age if birthday hasn't occurred yet this year
      if (
        now.getMonth() < birthdate.getMonth() || 
        (now.getMonth() === birthdate.getMonth() && now.getDate() < birthdate.getDate())
      ) {
        const adjustedAge = age - 1;
        
        // Users must be 21+ for GreenTrails
        if (adjustedAge < 21) {
          toast({
            title: "Age verification failed",
            description: "You must be 21 or older to use GreenTrails.",
            variant: "destructive",
          });
          return false;
        }
      }
      
      // User is at least 21, update their profile
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({ is_age_verified: true })
          .eq('id', user.id);
          
        if (error) {
          console.error('Error updating age verification status:', error);
          return false;
        }
        
        // Log successful age verification
        await DatabaseSetupService.logSecurityEvent('age_verification', {
          user_id: user.id,
          verified: true,
          timestamp: new Date().toISOString()
        });
        
        toast({
          title: "Age verification successful",
          description: "Your account has been verified as 21+.",
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error verifying age:', error);
      return false;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        console.error('Error resetting password:', error);
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, message: error.message };
      }

      toast({
        title: "Password reset email sent",
        description: "Please check your email to reset your password.",
      });

      return { success: true };
    } catch (error) {
      console.error('Exception during password reset:', error);
      
      if (error instanceof Error) {
        return { success: false, message: error.message };
      }
      return { success: false, message: 'An unknown error occurred' };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        console.error('Error updating password:', error);
        toast({
          title: "Password update failed",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, message: error.message };
      }

      // Log password update for security audit
      if (user) {
        await DatabaseSetupService.logSecurityEvent('password_updated', { 
          user_id: user.id,
          timestamp: new Date().toISOString() 
        });
      }

      toast({
        title: "Password updated successfully",
        description: "Your password has been changed.",
      });

      return { success: true };
    } catch (error) {
      console.error('Exception during password update:', error);
      
      if (error instanceof Error) {
        return { success: false, message: error.message };
      }
      return { success: false, message: 'An unknown error occurred' };
    }
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
