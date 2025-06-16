
import React, { useEffect } from 'react';
import { useEasterEggs } from '@/contexts/easter-eggs-context';
import { useKonamiCode } from '@/hooks/use-konami-code';

export const KonamiCodeHandler: React.FC = () => {
  const { triggerKonamiEasterEgg } = useEasterEggs();

  useKonamiCode(triggerKonamiEasterEgg);

  return null;
};
