
import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';

interface EasterEggsContextType {
  isDevMode: boolean;
  isCatMode: boolean;
  secretTrailsUnlocked: boolean;
  toggleDevMode: () => void;
  toggleCatMode: () => void;
  unlockSecretTrails: () => void;
  triggerKonamiEasterEgg: () => void;
}

const EasterEggsContext = createContext<EasterEggsContextType | undefined>(undefined);

export const EasterEggsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDevMode, setIsDevMode] = useState(false);
  const [isCatMode, setIsCatMode] = useState(false);
  const [secretTrailsUnlocked, setSecretTrailsUnlocked] = useState(false);
  const { toast } = useToast();

  // Load easter egg states from localStorage
  useEffect(() => {
    const savedDevMode = localStorage.getItem('greentrails-dev-mode') === 'true';
    const savedCatMode = localStorage.getItem('greentrails-cat-mode') === 'true';
    const savedSecretTrails = localStorage.getItem('greentrails-secret-trails') === 'true';
    
    setIsDevMode(savedDevMode);
    setIsCatMode(savedCatMode);
    setSecretTrailsUnlocked(savedSecretTrails);
  }, []);

  const toggleDevMode = () => {
    const newState = !isDevMode;
    setIsDevMode(newState);
    localStorage.setItem('greentrails-dev-mode', newState.toString());
    toast({
      title: newState ? "🔧 Developer Mode Activated" : "Developer Mode Deactivated",
      description: newState ? "Secret features unlocked!" : "Back to normal mode",
    });
  };

  const toggleCatMode = () => {
    const newState = !isCatMode;
    setIsCatMode(newState);
    localStorage.setItem('greentrails-cat-mode', newState.toString());
    toast({
      title: newState ? "🐱 Cat Mode Activated!" : "Cat Mode Deactivated",
      description: newState ? "Meow! Trail images replaced with cats!" : "Back to regular trails",
    });
  };

  const unlockSecretTrails = () => {
    setSecretTrailsUnlocked(true);
    localStorage.setItem('greentrails-secret-trails', 'true');
    toast({
      title: "🗝️ Secret Trails Unlocked!",
      description: "You've discovered hidden trails only known to the most dedicated explorers!",
    });
  };

  const triggerKonamiEasterEgg = () => {
    // Epic confetti explosion
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#22c55e', '#16a34a', '#15803d'];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    toast({
      title: "🎮 KONAMI CODE ACTIVATED!",
      description: "You are a true gamer! All easter eggs have been unlocked!",
      duration: 5000,
    });

    // Unlock everything
    toggleDevMode();
    unlockSecretTrails();
  };

  return (
    <EasterEggsContext.Provider value={{
      isDevMode,
      isCatMode,
      secretTrailsUnlocked,
      toggleDevMode,
      toggleCatMode,
      unlockSecretTrails,
      triggerKonamiEasterEgg
    }}>
      {children}
    </EasterEggsContext.Provider>
  );
};

export const useEasterEggs = () => {
  const context = useContext(EasterEggsContext);
  if (context === undefined) {
    throw new Error('useEasterEggs must be used within an EasterEggsProvider');
  }
  return context;
};
