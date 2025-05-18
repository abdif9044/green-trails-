
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { DemoAccountService } from '@/services/auth/demo-account-service';
import { storeCredentials, clearStoredCredentials, DemoCredentials } from '@/utils/demo-account-storage';

/**
 * Hook for demo account operations
 * Handles creating and signing in with demo accounts
 */
export function useDemoAccountOperations(
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  setDemoCredentials: (credentials: DemoCredentials | null) => void
) {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  /**
   * Creates a new demo account
   */
  const createDemoAccount = async () => {
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
  
  /**
   * Signs in with an existing demo account
   * @param credentials Optional credentials to use (will use stored credentials if not provided)
   */
  const signInWithDemoAccount = async (credentials?: DemoCredentials) => {
    const demoCredentials = getValidDemoCredentials(credentials);
    
    if (!demoCredentials) {
      handleNoCredentialsError();
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Attempting to sign in with demo account: ${demoCredentials.email}`);
      const result = await performDemoSignIn(demoCredentials);
      
      if (result.success) {
        handleSuccessfulSignIn();
      } else {
        handleFailedSignIn(result.message);
      }
    } catch (err) {
      handleSignInError(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gets valid demo credentials from provided or stored credentials
   * @param credentials Optional credentials to use
   * @returns Valid credentials or null if none available
   */
  const getValidDemoCredentials = (credentials?: DemoCredentials): DemoCredentials | null => {
    if (credentials) return credentials;
    
    const storedEmail = sessionStorage.getItem('greentrails.demo.email');
    const storedPassword = sessionStorage.getItem('greentrails.demo.password');
    
    if (storedEmail && storedPassword) {
      return { email: storedEmail, password: storedPassword };
    }
    
    return null;
  };

  /**
   * Handles the error case when no demo credentials are available
   */
  const handleNoCredentialsError = () => {
    const errorMessage = 'No demo credentials available';
    setError(errorMessage);
    toast({
      title: "No demo credentials",
      description: "Cannot find demo account credentials. Please create a new demo account.",
      variant: "destructive",
    });
  };

  /**
   * Performs the actual sign in operation with demo credentials
   * @param demoCredentials The demo account credentials
   * @returns Result of the sign in operation
   */
  const performDemoSignIn = async (demoCredentials: DemoCredentials) => {
    return await signIn(demoCredentials.email, demoCredentials.password);
  };

  /**
   * Handles successful sign in
   */
  const handleSuccessfulSignIn = () => {
    toast({
      title: "Signed in!",
      description: "Welcome to GreenTrails! You're exploring as a demo user.",
      variant: "default",
    });
    navigate('/discover', { replace: true });
  };

  /**
   * Handles failed sign in
   * @param message Error message from sign in attempt
   */
  const handleFailedSignIn = (message?: string) => {
    // If sign-in failed, clear stored credentials as they may be invalid
    clearStoredCredentials();
    setDemoCredentials(null);
    
    const errorMessage = message || 'Failed to sign in with demo account';
    setError(errorMessage);
    toast({
      title: "Sign in failed",
      description: errorMessage,
      variant: "destructive",
    });
  };

  /**
   * Handles any errors that occur during sign in
   * @param err The error that occurred
   */
  const handleSignInError = (err: unknown) => {
    console.error('Exception in signInWithDemoAccount hook:', err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    setError(errorMessage);
    toast({
      title: "Sign in error",
      description: errorMessage,
      variant: "destructive",
    });
  };

  return {
    createDemoAccount,
    signInWithDemoAccount
  };
}
