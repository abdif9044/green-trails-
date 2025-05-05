
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { AuthService } from '@/services/auth';

export const useAuthMethods = (user: User | null) => {
  const { toast } = useToast();

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

  return {
    signIn,
    signUp,
    signOut,
  };
};
