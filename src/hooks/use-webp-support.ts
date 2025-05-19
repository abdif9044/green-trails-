
import { useState, useEffect } from 'react';

/**
 * Hook to check browser support for WebP image format
 */
export const useWebPSupport = (): boolean | null => {
  const [supportsWebP, setSupportsWebP] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkWebPSupport = async () => {
      try {
        const webPCheck = document.createElement('canvas');
        if (webPCheck.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
          setSupportsWebP(true);
        } else {
          setSupportsWebP(false);
        }
      } catch (e) {
        setSupportsWebP(false);
      }
    };
    
    checkWebPSupport();
  }, []);
  
  return supportsWebP;
};
