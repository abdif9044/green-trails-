
import { useState, useEffect, useRef } from 'react';

/**
 * Hook for lazy loading elements when they enter the viewport
 */
export const useLazyLoad = (rootMargin = "200px", threshold = 0.01) => {
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  useEffect(() => {
    // Clean up previous observer if it exists
    if (observerRef.current && elementRef.current) {
      observerRef.current.unobserve(elementRef.current);
    }
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (observerRef.current) {
              observerRef.current.unobserve(entry.target);
            }
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    if (elementRef.current && observerRef.current) {
      observerRef.current.observe(elementRef.current);
    }

    return () => {
      if (observerRef.current && elementRef.current) {
        observerRef.current.unobserve(elementRef.current);
        observerRef.current.disconnect();
      }
    };
  }, [rootMargin, threshold]);

  return { isInView, elementRef };
};
