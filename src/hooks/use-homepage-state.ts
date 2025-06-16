
import { useState } from 'react';
import { useBadges } from '@/hooks/use-badges';
import { useAuth } from '@/hooks/use-auth';
import { useEasterEggs } from '@/contexts/easter-eggs-context';

export const useHomepageState = () => {
  const { user } = useAuth();
  const { badges, loading } = useBadges();
  const [showDevConsole, setShowDevConsole] = useState(false);
  const { isDevMode, toggleDevMode } = useEasterEggs();

  return {
    user,
    badges,
    loading,
    showDevConsole,
    setShowDevConsole,
    isDevMode,
    toggleDevMode,
  };
};
