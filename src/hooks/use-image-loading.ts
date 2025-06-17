
import { useState, useEffect } from 'react';

interface UseImageLoadingProps {
  src: string;
  onLoad?: () => void;
}

export const useImageLoading = ({ src, onLoad }: UseImageLoadingProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Reset states when src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  // Handle image error
  const handleError = () => {
    console.warn(`Image failed to load: ${src}`);
    setHasError(true);
  };

  return {
    isLoaded,
    hasError,
    handleLoad,
    handleError
  };
};
