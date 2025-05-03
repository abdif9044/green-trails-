
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, dateOfBirth?: Date) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  loading: boolean;
  updateUserMetadata: (metadata: Record<string, any>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session);
        setSession(session);
        setUser(session?.user ?? null);

        // Use setTimeout to avoid potential Supabase deadlocks
        if (event === 'SIGNED_IN') {
          setTimeout(() => {
            toast({
              title: "Successfully signed in",
              description: "Welcome to GreenTrails!",
              variant: "default",
            });
            // Navigate is handled in component, not here
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setTimeout(() => {
            toast({
              title: "Signed out",
              description: "You have been signed out successfully",
            });
          }, 0);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (!validateEmail(email)) {
        return { error: new Error('Please enter a valid email address') };
      }

      if (!password || password.length < 6) {
        return { error: new Error('Password must be at least 6 characters') };
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error) {
        // Check if user's session exists after signing in
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          console.log("User signed in successfully with session:", data.session);
        }
      } else {
        console.error("Sign in error:", error.message);
        // Provide more user-friendly error messages
        if (error.message.includes('credentials')) {
          return { error: new Error('Invalid email or password') };
        }
      }
      
      return { error };
    } catch (err) {
      console.error('Sign in error:', err);
      return { error: err as Error };
    }
  };

  const signUp = async (email: string, password: string, dateOfBirth?: Date) => {
    try {
      if (!validateEmail(email)) {
        return { error: new Error('Please enter a valid email address') };
      }
      
      if (!password || password.length < 6) {
        return { error: new Error('Password must be at least 6 characters') };
      }
      
      let userMetadata = {};
      
      if (dateOfBirth) {
        // If date of birth is provided, add it to user metadata
        const isOver21 = isUserOver21(dateOfBirth);
        
        userMetadata = {
          date_of_birth: dateOfBirth.toISOString().split('T')[0],
          age_verified: isOver21
        };
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata,
          emailRedirectTo: window.location.origin + '/auth'
        }
      });
      
      if (!error) {
        toast({
          title: "Account created",
          description: "Check your email to confirm your account before signing in.",
        });
      } else {
        console.error("Sign up error:", error.message);
        
        // Provide more user-friendly error messages
        if (error.message.includes('already registered')) {
          return { error: new Error('This email is already registered. Please sign in instead.') };
        } else if (error.message.includes('weak')) {
          return { error: new Error('Password is too weak. Please choose a stronger password.') };
        } else if (error.message.includes('captcha')) {
          return { error: new Error('Captcha verification failed. Please try again in a different browser.') };
        }
      }
      
      return { error };
    } catch (err) {
      console.error('Sign up error:', err);
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };
  
  const updateUserMetadata = async (metadata: Record<string, any>) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: metadata
      });
      
      if (!error) {
        toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully.",
        });
      }
      
      return { error };
    } catch (err) {
      console.error('Update user metadata error:', err);
      return { error: err as Error };
    }
  };
  
  // Helper function to check if user is over 21
  const isUserOver21 = (birthDate: Date): boolean => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 21;
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      signIn, 
      signUp, 
      signOut, 
      loading,
      updateUserMetadata 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
