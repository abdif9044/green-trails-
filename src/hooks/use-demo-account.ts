
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { SignUpService } from '@/services/auth/sign-up-service';

export interface DemoCredentials {
  email: string;
  password: string;
}

export function useDemoAccount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoCredentials, setDemoCredentials] = useState<DemoCredentials | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const createDemoAccount = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting to create demo account...');
      const result = await SignUpService.createDemoAccount();
      console.log('Demo account creation result:', result);
      
      if (result.success && result.credentials) {
        setDemoCredentials(result.credentials);
        toast({
          title: "Demo account created!",
          description: `You can now explore GreenTrails as ${result.credentials.email}`,
          variant: "default",
        });
        
        // If the auto-login has already happened, redirect
        if (!result.message.includes('auto-login failed')) {
          navigate('/discover', { replace: true });
          return;
        }
      } else {
        setError(result.message || 'Unknown error occurred');
        toast({
          title: "Failed to create demo account",
          description: result.message || 'Unknown error occurred',
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Exception in createDemoAccount hook:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const signInWithDemoAccount = async () => {
    if (!demoCredentials) {
      setError('No demo credentials available');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Attempting to sign in with demo account: ${demoCredentials.email}`);
      const result = await signIn(demoCredentials.email, demoCredentials.password);
      console.log('Demo sign in result:', result);
      
      if (result.success) {
        toast({
          title: "Signed in!",
          description: "Welcome to GreenTrails! You're exploring as a demo user.",
          variant: "default",
        });
        navigate('/discover', { replace: true });
      } else {
        setError(result.message || 'Failed to sign in with demo account');
        toast({
          title: "Sign in failed",
          description: result.message || "Failed to sign in with demo account",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Exception in signInWithDemoAccount hook:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({
        title: "Sign in error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset error state
  const clearError = () => {
    setError(null);
  };

  return {
    loading,
    error,
    demoCredentials,
    createDemoAccount,
    signInWithDemoAccount,
    setError,
    clearError
  };
}
