
import { useDemoAccountState } from './use-demo-account-state';
import { useDemoAccountOperations } from './use-demo-account-operations';
import { DemoCredentials } from '@/utils/demo-account-storage';

/**
 * Combined hook for demo account functionality
 * Provides state management and operations for demo accounts
 */
export function useDemoAccount() {
  const {
    loading,
    setLoading,
    error,
    setError,
    demoCredentials,
    setDemoCredentials,
    clearError
  } = useDemoAccountState();

  const {
    createDemoAccount,
    signInWithDemoAccount
  } = useDemoAccountOperations(setLoading, setError, setDemoCredentials);

  return {
    // State
    loading,
    error,
    demoCredentials,
    
    // Operations
    createDemoAccount,
    signInWithDemoAccount,
    
    // Helpers
    clearError
  };
}

// Re-export types
export type { DemoCredentials } from '@/utils/demo-account-storage';
