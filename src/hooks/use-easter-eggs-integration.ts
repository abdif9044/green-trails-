
import * as React from 'react';
import { useEasterEggs } from '@/contexts/easter-eggs-context';

export const useEasterEggsIntegration = () => {
  const { isDevMode, toggleDevMode } = useEasterEggs();
  const [showDevConsole, setShowDevConsole] = React.useState(false);

  // Safely handle Konami code integration
  React.useEffect(() => {
    let konamiHandler: (() => void) | null = null;
    
    const setupKonamiCode = async () => {
      try {
        const { useKonamiCode } = await import('@/hooks/use-konami-code');
        konamiHandler = () => toggleDevMode();
        useKonamiCode(konamiHandler);
      } catch (error) {
        console.warn('Failed to load Konami code handler:', error);
      }
    };

    if (isDevMode) {
      setupKonamiCode();
    }

    return () => {
      konamiHandler = null;
    };
  }, [isDevMode, toggleDevMode]);

  return {
    isDevMode,
    toggleDevMode,
    showDevConsole,
    setShowDevConsole
  };
};
