/**
 * Bootstrap Loader - Safe async initialization for trail systems
 * Replaces unsafe Promise.resolve().then() pattern with proper React component
 */

import { useEffect } from 'react';

const BootstrapLoader: React.FC = () => {
  useEffect(() => {
    let mounted = true;

    const initializeBootstrap = async () => {
      try {
        // Only initialize if component is still mounted
        if (!mounted) return;

        const { useAutoTrailBootstrap } = await import('../hooks/use-auto-trail-bootstrap');
        
        if (mounted) {
          console.log('🚀 Auto trail bootstrap system loaded safely');
        }
      } catch (error) {
        if (mounted) {
          console.warn('Auto trail bootstrap failed to load:', error);
        }
      }
    };

    initializeBootstrap();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, []);

  // This component doesn't render anything, it just handles initialization
  return null;
};

export default BootstrapLoader;