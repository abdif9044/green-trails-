import { useState, useEffect, useRef } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
  animationClass?: string;
}

export function useScrollAnimation(
  index: number = 0,
  options: UseScrollAnimationOptions = {}
) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  
  const {
    threshold = 0.1,
    rootMargin = '50px',
    delay = 0,
    animationClass = 'animate-slide-in'
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add staggered delay based on index
            const staggerDelay = delay + (index * 150); // 150ms between each card
            
            setTimeout(() => {
              setIsVisible(true);
            }, staggerDelay);
            
            // Stop observing once visible
            observer.unobserve(element);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [index, threshold, rootMargin, delay]);

  // Determine slide direction based on index (alternating sides)
  const slideDirection = index % 2 === 0 ? 'left' : 'right';
  
  return {
    elementRef,
    isVisible,
    slideDirection,
    animationClass: `${animationClass}-${slideDirection}`
  };
}