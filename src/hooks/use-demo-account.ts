
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { DemoAccountService, DemoAccountCredentials } from '@/services/auth/demo-account-service';

// Storage keys for demo credentials
const STORAGE_KEY_EMAIL = 'greentrails.demo.email';
const STORAGE_KEY_PASSWORD = 'greentrails.demo.password';
const STORAGE_KEY_CREATED = 'greentrails.demo.created';

export function useDemoAccount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoCredentials, setDemoCredentials] = useState<DemoAccountCredentials | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn, user } = useAuth();

  // Load saved credentials on component mount
  useEffect(() => {
    const loadSavedCredentials = () => {
      try {
        const email = sessionStorage.getItem(STORAGE_KEY_EMAIL);
        const password = sessionStorage.getItem(STORAGE_KEY_PASSWORD);
        const createdTime = sessionStorage.getItem(STORAGE_KEY_CREATED);
      
        // If we have all the required data and it's not too old (24 hours)
        if (email && password && createdTime) {
          const created = parseInt(createdTime);
          const now = Date.now();
          const dayInMs = 24 * 60 * 60 * 1000;
          
          // Only use credentials if they're less than 24 hours old
          if (now - created < dayInMs) {
            setDemoCredentials({ email, password });
            return;
          } else {
            // Credentials too old, clear them
            clearStoredCredentials();
          }
        }
      } catch (err) {
        console.error("Error loading saved demo credentials:", err);
        clearStoredCredentials();
      }
    };
    
    loadSavedCredentials();
  }, []);

  // Clear stored credentials helper
  const clearStoredCredentials = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY_EMAIL);
      sessionStorage.removeItem(STORAGE_KEY_PASSWORD);
      sessionStorage.removeItem(STORAGE_KEY_CREATED);
    } catch (err) {
      console.error("Error clearing demo credentials:", err);
    }
  };

  // Store credentials helper
  const storeCredentials = (email: string, password: string) => {
    try {
      sessionStorage.setItem(STORAGE_KEY_EMAIL, email);
      sessionStorage.setItem(STORAGE_KEY_PASSWORD, password);
      sessionStorage.setItem(STORAGE_KEY_CREATED, Date.now().toString());
    } catch (err) {
      console.error("Error storing demo credentials:", err);
    }
  };

  const createDemoAccount = async () => {
    if (loading) return; // Prevent multiple calls
    if (user) {
      toast({
        title: "Already signed in",
        description: "You're already signed in to an account. Please sign out first to create a demo account.",
        variant: "default",
      });
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting to create demo account...');
      const result = await DemoAccountService.createDemoAccount();
      console.log('Demo account creation result:', result);
      
      if (result.success && result.credentials) {
        setDemoCredentials(result.credentials);
        storeCredentials(result.credentials.email, result.credentials.password);
        
        toast({
          title: "Demo account created!",
          description: `You can now explore GreenTrails as ${result.credentials.email}`,
          variant: "default",
        });
        
        // If the auto-login has already happened, redirect
        if (!result.message.includes('auto-login failed')) {
          setTimeout(() => {
            navigate('/discover', { replace: true });
          }, 500);
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
    const credentials = demoCredentials || {
      email: sessionStorage.getItem(STORAGE_KEY_EMAIL) || '',
      password: sessionStorage.getItem(STORAGE_KEY_PASSWORD) || ''
    };
    
    if (!credentials.email || !credentials.password) {
      setError('No demo credentials available');
      toast({
        title: "No demo credentials",
        description: "Cannot find demo account credentials. Please create a new demo account.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Attempting to sign in with demo account: ${credentials.email}`);
      const result = await signIn(credentials.email, credentials.password);
      console.log('Demo sign in result:', result);
      
      if (result.success) {
        toast({
          title: "Signed in!",
          description: "Welcome to GreenTrails! You're exploring as a demo user.",
          variant: "default",
        });
        navigate('/discover', { replace: true });
      } else {
        // If sign-in failed, clear stored credentials as they may be invalid
        clearStoredCredentials();
        setDemoCredentials(null);
        
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
