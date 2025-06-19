
import React from 'react';

// Utility to ensure React is properly initialized before using hooks
export const ensureReactReady = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check if React is available and properly initialized
  if (typeof React === 'undefined') {
    console.warn('React not available globally');
    return false;
  }
  
  // Check if React hooks dispatcher is available
  try {
    const reactInternals = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    if (!reactInternals?.ReactCurrentDispatcher?.current) {
      console.warn('React dispatcher not ready');
      return false;
    }
    return true;
  } catch (error) {
    console.warn('React internals check failed:', error);
    return false;
  }
};

export const withReactSafety = <T extends (...args: any[]) => any>(
  hookFn: T,
  fallbackValue: ReturnType<T>
): T => {
  return ((...args: Parameters<T>): ReturnType<T> => {
    if (!ensureReactReady()) {
      console.warn('React not ready, returning fallback value');
      return fallbackValue;
    }
    
    try {
      return hookFn(...args);
    } catch (error) {
      console.error('Hook execution failed:', error);
      return fallbackValue;
    }
  }) as T;
};
