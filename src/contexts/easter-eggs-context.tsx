
import * as React from 'react';
import confetti from 'canvas-confetti';
import { toast } from '@/components/ui/sonner';
import { useEasterEggStorage } from '@/hooks/use-easter-egg-storage';

interface EasterEggsContextType {
  isDevMode: boolean;
  isCatMode: boolean;
  secretTrailsUnlocked: boolean;
  toggleDevMode: () => void;
  toggleCatMode: () => void;
  unlockSecretTrails: () => void;
  triggerKonamiEasterEgg: () => void;
}

const EasterEggsContext = React.createContext<EasterEggsContextType | undefined>(undefined);

export const EasterEggsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    isDevMode,
    isCatMode,
    secretTrailsUnlocked,
    loaded,
    updateDevMode,
    updateCatMode,
    updateSecretTrails,
  } = useEasterEggStorage();

  const toggleDevMode = React.useCallback(() => {
    const newState = !isDevMode;
    updateDevMode(newState);
    console.log(newState ? "🔧 Developer Mode Activated" : "Developer Mode Deactivated");
    toast(newState ? "🔧 Developer Mode Activated" : "Developer Mode Deactivated", {
      description: newState ? "Secret features unlocked!" : "Back to normal mode",
    });
  }, [isDevMode, updateDevMode]);

  const toggleCatMode = React.useCallback(() => {
    const newState = !isCatMode;
    updateCatMode(newState);
    console.log(newState ? "🐱 Cat Mode Activated!" : "Cat Mode Deactivated");
    toast(newState ? "🐱 Cat Mode Activated!" : "Cat Mode Deactivated", {
      description: newState ? "Meow! Trail images replaced with cats!" : "Back to regular trails",
    });
  }, [isCatMode, updateCatMode]);

  const unlockSecretTrails = React.useCallback(() => {
    if (secretTrailsUnlocked) return;
    updateSecretTrails(true);
    console.log("🗝️ Secret Trails Unlocked!");
    toast("🗝️ Secret Trails Unlocked!", {
      description: "You've discovered hidden trails only known to the most dedicated explorers!",
    });
  }, [secretTrailsUnlocked, updateSecretTrails]);

  const triggerKonamiEasterEgg = React.useCallback(() => {
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

    console.log("🎮 KONAMI CODE ACTIVATED!");
    toast("🎮 KONAMI CODE ACTIVATED!", {
      description: "You are a true gamer! All easter eggs have been unlocked!",
      duration: 5000,
    });

    if (!isDevMode) {
      toggleDevMode();
    }
    unlockSecretTrails();
  }, [isDevMode, toggleDevMode, unlockSecretTrails]);

  if (!loaded) return null;

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
  const context = React.useContext(EasterEggsContext);
  if (context === undefined) {
    throw new Error('useEasterEggs must be used within an EasterEggsProvider');
  }
  return context;
};
