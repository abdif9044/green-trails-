
import { useState, useEffect } from 'react';

interface EasterEggStorageState {
  isDevMode: boolean;
  isCatMode: boolean;
  secretTrailsUnlocked: boolean;
}

export const useEasterEggStorage = () => {
  const [state, setState] = useState<EasterEggStorageState>({
    isDevMode: false,
    isCatMode: false,
    secretTrailsUnlocked: false,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedDevMode = localStorage.getItem('greentrails-dev-mode') === 'true';
    const savedCatMode = localStorage.getItem('greentrails-cat-mode') === 'true';
    const savedSecretTrails = localStorage.getItem('greentrails-secret-trails') === 'true';
    
    setState({
      isDevMode: savedDevMode,
      isCatMode: savedCatMode,
      secretTrailsUnlocked: savedSecretTrails,
    });
    setLoaded(true);
  }, []);

  const updateDevMode = (newState: boolean) => {
    setState(prev => ({ ...prev, isDevMode: newState }));
    localStorage.setItem('greentrails-dev-mode', newState.toString());
  };

  const updateCatMode = (newState: boolean) => {
    setState(prev => ({ ...prev, isCatMode: newState }));
    localStorage.setItem('greentrails-cat-mode', newState.toString());
  };

  const updateSecretTrails = (newState: boolean) => {
    setState(prev => ({ ...prev, secretTrailsUnlocked: newState }));
    localStorage.setItem('greentrails-secret-trails', newState.toString());
  };

  return {
    ...state,
    loaded,
    updateDevMode,
    updateCatMode,
    updateSecretTrails,
  };
};
