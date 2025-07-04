
import * as React from 'react';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

export const useKonamiCode = (callback: () => void) => {
  const [sequence, setSequence] = React.useState<string[]>([]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setSequence(prev => {
        const newSequence = [...prev, event.code];
        if (newSequence.length > KONAMI_CODE.length) {
          newSequence.shift();
        }
        if (newSequence.length === KONAMI_CODE.length) {
          const matches = newSequence.every((key, index) => key === KONAMI_CODE[index]);
          if (matches) {
            callback();
            return [];
          }
        }
        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callback]);

  return sequence;
};
