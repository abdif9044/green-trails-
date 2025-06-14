import React, { useState } from 'react';
import { toast } from '@/components/ui/sonner';
import confetti from 'canvas-confetti';

interface ClickableEasterEggProps {
  children: React.ReactNode;
  requiredClicks?: number;
  message?: string;
  action?: () => void;
}

const ClickableEasterEgg: React.FC<ClickableEasterEggProps> = ({
  children,
  requiredClicks = 7,
  message = "You found a secret! 🎉",
  action
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [hasTriggered, setHasTriggered] = useState(false);

  const handleClick = () => {
    if (hasTriggered) return;

    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount === requiredClicks) {
      setHasTriggered(true);
      
      // Small confetti burst
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#16a34a', '#15803d']
      });

      toast(message, {
        description: `You clicked ${requiredClicks} times! Here's your reward!`,
      });

      if (action) {
        action();
      }

      // Reset after 5 seconds
      setTimeout(() => {
        setClickCount(0);
        setHasTriggered(false);
      }, 5000);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`cursor-pointer select-none ${hasTriggered ? 'animate-pulse' : ''}`}
      title={hasTriggered ? "Easter egg activated!" : `${clickCount}/${requiredClicks} clicks`}
    >
      {children}
    </div>
  );
};

export default ClickableEasterEgg;
