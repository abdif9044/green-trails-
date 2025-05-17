
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { AuthService } from '@/services/auth';
import { supabase } from '@/integrations/supabase/client';

export const useAuthMethods = (user: User | null) => {
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    console.log(`Attempting sign in for user: ${email}`);
    
    try {
      // Proceed with sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in failed:', error.message);
        
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
        
        return { success: false, message: error.message };
      }
      
      console.log('Sign in successful for:', email);
      
      // Store session information in localStorage for persistence
      localStorage.setItem('greentrails.user_email', email);
      
      toast({
        title: "Sign in successful",
        description: "Welcome back to GreenTrails!",
      });
      
      return { success: true, user: data.user };
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
    console.log(`Attempting sign up for new user: ${email}`);
    
    try {
      // Verify age requirement is included in metadata
      if (!metadata.hasOwnProperty('birthdate')) {
        console.warn('Signup attempt without birthdate. Age verification is required.');
        toast({
          title: "Missing information",
          description: "Date of birth is required for age verification.",
          variant: "destructive",
        });
        return { success: false, message: "Date of birth is required" };
      }
      
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...metadata,
            signup_timestamp: new Date().toISOString(),
          },
          // Set a more reasonable session duration
          emailRedirectTo: window.location.origin + '/auth',
        }
      });
      
      if (error) {
        console.error('Sign up failed:', error.message);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, message: error.message };
      }
      
      // Handle email confirmation
      if (!data.session) {
        toast({
          title: "Account created",
          description: "Please check your email to confirm your account before signing in.",
        });
      } else {
        // Store the user email for later reference
        localStorage.setItem('greentrails.user_email', email);
        
        toast({
          title: "Account created successfully",
          description: "Welcome to GreenTrails! Your account is ready.",
        });
      }
      
      return { 
        success: true, 
        user: data.user
      };
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
    console.log('Attempting to sign out user:', user?.email);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out failed:', error.message);
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, message: error.message };
      }
      
      // Clear any stored auth data
      localStorage.removeItem('greentrails.user_email');
      
      return { success: true };
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

  return {
    signIn,
    signUp,
    signOut,
  };
};
