
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { AuthService } from '@/services/auth';
import { checkSupabaseConnection } from '@/utils/auth-utils';

export const useAuthMethods = (user: User | null) => {
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    console.log(`Attempting sign in for user: ${email}`);
    
    try {
      // First verify Supabase connection
      const connectionStatus = await checkSupabaseConnection();
      if (!connectionStatus.connected) {
        console.error('Supabase connection failed before sign in:', connectionStatus.message);
        toast({
          title: "Connection error",
          description: "Unable to connect to the authentication service. Please check your internet connection.",
          variant: "destructive",
        });
        return { success: false, message: "Connection error: " + connectionStatus.message };
      }
      
      // Proceed with sign in
      const result = await AuthService.signIn(email, password);
      
      if (!result.success) {
        console.error('Sign in failed:', result.message);
        let errorMessage = result.message || "An error occurred during sign in";
        
        // Provide more user-friendly messages for common errors
        if (result.message?.includes('Invalid login')) {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (result.message?.includes('Email not confirmed')) {
          errorMessage = "Please confirm your email before signing in.";
        } else if (result.message?.includes('rate limit')) {
          errorMessage = "Too many login attempts. Please try again later.";
        }
        
        toast({
          title: "Sign in failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        console.log('Sign in successful for:', email);
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
    console.log(`Attempting sign up for new user: ${email}`);
    
    try {
      // First verify Supabase connection
      const connectionStatus = await checkSupabaseConnection();
      if (!connectionStatus.connected) {
        console.error('Supabase connection failed before sign up:', connectionStatus.message);
        toast({
          title: "Connection error",
          description: "Unable to connect to the authentication service. Please check your internet connection.",
          variant: "destructive",
        });
        return { success: false, message: "Connection error: " + connectionStatus.message };
      }
      
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
      
      // Enhanced metadata for better tracking
      const enhancedMetadata = {
        ...metadata,
        signup_timestamp: new Date().toISOString(),
        initial_signup_ip: await fetchClientIP(),
      };
      
      const result = await AuthService.signUp(email, password, enhancedMetadata);
      
      if (result.success) {
        console.log('Sign up successful for:', email);
        toast({
          title: "Account created successfully",
          description: "You can now sign in with your credentials",
        });
      } else {
        console.error('Sign up failed:', result.message);
        let errorMessage = result.message || "An error occurred during sign up";
        
        // Provide more user-friendly messages for common errors
        if (result.message?.includes('already registered')) {
          errorMessage = "This email is already registered. Please sign in instead.";
        } else if (result.message?.includes('valid email')) {
          errorMessage = "Please provide a valid email address.";
        } else if (result.message?.includes('password')) {
          errorMessage = "Password must be at least 6 characters long.";
        } else if (result.message?.includes('captcha')) {
          errorMessage = "Captcha verification failed. Please try again with a different browser.";
        }
        
        toast({
          title: "Sign up failed",
          description: errorMessage,
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
    console.log('Attempting to sign out user:', user?.email);
    
    try {
      const result = await AuthService.signOut(user?.id);
      
      if (!result.success) {
        console.error('Sign out failed:', result.message);
        toast({
          title: "Sign out failed",
          description: result.message || "An error occurred during sign out",
          variant: "destructive",
        });
      } else {
        console.log('Sign out successful');
        // No need for toast here as NavbarAuth already shows one
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

  // Helper function to get client IP for security logging
  const fetchClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch (error) {
      console.warn('Could not fetch client IP (non-critical):', error);
      return 'unknown';
    }
  };

  return {
    signIn,
    signUp,
    signOut,
  };
};
