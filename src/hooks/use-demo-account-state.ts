
import { useState, useEffect } from 'react';
import { loadSavedCredentials, DemoCredentials } from '@/utils/demo-account-storage';

/**
 * Hook for managing demo account state
 * Handles loading credentials from storage and state management
 */
export function useDemoAccountState() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoCredentials, setDemoCredentials] = useState<DemoCredentials | null>(null);

  // Load saved credentials on component mount
  useEffect(() => {
    const savedCredentials = loadSavedCredentials();
    if (savedCredentials) {
      setDemoCredentials(savedCredentials);
    }
  }, []);

  // Reset error state
  const clearError = () => {
    setError(null);
  };

  return {
    loading,
    setLoading,
    error,
    setError,
    demoCredentials,
    setDemoCredentials,
    clearError
  };
}
