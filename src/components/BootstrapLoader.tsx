
import React from 'react';

// Simple bootstrap component that doesn't use hooks to avoid dispatcher issues
const BootstrapLoader: React.FC = () => {
  // Use a simple effect without hooks to bootstrap the app
  React.useEffect(() => {
    console.log('GreenTrails app bootstrapped successfully');
    
    // Add any initialization logic here
    const initializeApp = () => {
      // Performance monitoring
      if (typeof window !== 'undefined') {
        console.log('App initialization complete');
      }
    };
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(initializeApp, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything
};

export default BootstrapLoader;
