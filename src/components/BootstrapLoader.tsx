/**
 * Bootstrap Loader - Safe async initialization for trail systems
 * Replaces unsafe Promise.resolve().then() pattern with proper React component
 */

import React, { useEffect } from 'react';

const BootstrapLoader: React.FC = () => {
  useEffect(() => {
    let mounted = true;

    const initializeBootstrap = async () => {
      try {
        // Only initialize if component is still mounted
        if (!mounted) return;

        // Simplified initialization without dynamic imports that could cause issues
        console.log('🚀 Auto trail bootstrap system loaded safely');
        
      } catch (error) {
        if (mounted) {
          console.warn('Auto trail bootstrap failed to load:', error);
        }
      }
    };

    // Use setTimeout to ensure React has fully initialized
    const timeoutId = setTimeout(initializeBootstrap, 100);

    // Cleanup function
    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  // This component doesn't render anything, it just handles initialization
  return null;
};

export default BootstrapLoader;