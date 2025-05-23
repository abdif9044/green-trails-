
import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
}

export function useInfiniteScroll(
  callback: () => void,
  options: UseInfiniteScrollOptions = {}
) {
  const [isFetching, setIsFetching] = useState(false);
  const [targetElement, setTargetElement] = useState<Element | null>(null);

  const { threshold = 1.0, root = null, rootMargin = '0px' } = options;

  const ref = useCallback((node: Element | null) => {
    setTargetElement(node);
  }, []);

  useEffect(() => {
    if (!targetElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !isFetching) {
          setIsFetching(true);
          callback();
        }
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );

    observer.observe(targetElement);

    return () => {
      if (targetElement) {
        observer.unobserve(targetElement);
      }
    };
  }, [targetElement, callback, isFetching, threshold, root, rootMargin]);

  const resetFetching = useCallback(() => {
    setIsFetching(false);
  }, []);

  return { ref, isFetching, resetFetching };
}
