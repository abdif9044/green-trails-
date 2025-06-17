
import React, { useEffect, useState } from 'react';

export const useSafeReact = () => {
  const [isReactReady, setIsReactReady] = useState(false);

  useEffect(() => {
    // Ensure React is fully initialized
    const timer = setTimeout(() => {
      setIsReactReady(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return isReactReady;
};

export const withReactSafety = <T extends any[], R>(
  hookFn: (...args: T) => R,
  fallbackValue: R
) => {
  return (...args: T): R => {
    try {
      // Check if React context is available
      if (typeof React === 'undefined' || !React.useState) {
        console.warn('React hooks called before React initialization');
        return fallbackValue;
      }
      return hookFn(...args);
    } catch (error) {
      console.error('Hook execution failed:', error);
      return fallbackValue;
    }
  };
};
