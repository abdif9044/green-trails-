
import React, { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon } from "lucide-react";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  placeholderSrc?: string;
  onLoad?: () => void;
  fallbackImage?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}

// Curated nature images for better fallbacks
const NATURE_IMAGES = {
  forest: "https://images.unsplash.com/photo-1448375240586-882707db888b",
  mountain: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
  lake: "https://images.unsplash.com/photo-1544714042-5dc4f6a3c4ce",
  trail: "https://images.unsplash.com/photo-1551632811-561732d1e306",
  waterfall: "https://images.unsplash.com/photo-1546587348-d12660c30c50",
  valley: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5",
  default: "https://images.unsplash.com/photo-1469474968028-56623f02e42e"
};

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = "",
  width,
  height,
  placeholderSrc = "/placeholder.svg",
  onLoad,
  fallbackImage = NATURE_IMAGES.default,
  objectFit = "cover",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Reset states when src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  // Set up the intersection observer
  useEffect(() => {
    // Clean up previous observer if it exists
    if (observerRef.current && imgRef.current) {
      observerRef.current.unobserve(imgRef.current);
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
        rootMargin: "200px", // Increased for better prefetching
        threshold: 0.01,
      }
    );

    if (imgRef.current && observerRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current && imgRef.current) {
        observerRef.current.unobserve(imgRef.current);
        observerRef.current.disconnect();
      }
    };
  }, []);

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

  // Style for the container to prevent layout shifts
  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: width ? (typeof width === 'number' ? `${width}px` : width) : "100%",
    height: height ? (typeof height === 'number' ? `${height}px` : height) : "auto",
    overflow: "hidden",
  };

  // Add WebP support detection
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

  // Enhanced source validation - completely prevents phone screenshots or problematic images
  const isValidSource = (source: string): boolean => {
    if (!source) return false;
    
    // Stringent checks for problematic image sources
    const invalidPatterns = [
      'screen', 'phone', 'mobile', 'device', 'iphone', 'android', 'screenshot',
      'data:image', 'blob:', 'localhost', '127.0.0.1', 'http://localhost',
      'lovable-uploads', 'base64', 'test', 'demo', 'fake'
    ];
    
    // If the source contains any of these patterns, reject it
    for (const pattern of invalidPatterns) {
      if (source.toLowerCase().includes(pattern)) {
        return false;
      }
    }
    
    // Only accept sources from trusted domains
    const trustedDomains = [
      'unsplash.com', 'images.unsplash.com',
      'pexels.com', 'images.pexels.com',
      'githubusercontent.com',
      'greentrails.global', // Our app domain
      'supabase.co', 'supabase.in'
    ];
    
    try {
      const url = new URL(source, window.location.origin);
      return trustedDomains.some(domain => url.hostname.includes(domain));
    } catch {
      // If URL creation fails, reject the source
      return false;
    }
  };

  // Get a nature-themed fallback based on alt text
  const getNatureFallback = () => {
    if (!alt) return fallbackImage || NATURE_IMAGES.default;
    
    const altLower = alt.toLowerCase();
    
    for (const [key, value] of Object.entries(NATURE_IMAGES)) {
      if (altLower.includes(key)) {
        return value;
      }
    }
    
    return fallbackImage || NATURE_IMAGES.default;
  };

  // Get actual image source to display
  const getImageSource = () => {
    // If not in view yet, use placeholder
    if (!isInView) return placeholderSrc;
    
    // If we've already detected an error or the source is invalid, use fallback
    if (hasError || !isValidSource(src)) {
      return getNatureFallback();
    }
    
    // Source is valid and we're in view
    return src;
  };

  return (
    <div style={containerStyle} ref={imgRef}>
      {!isLoaded && <Skeleton className="absolute inset-0" />}
      
      {(hasError || !isValidSource(src)) && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      
      {isInView && (
        <picture>
          {supportsWebP && isValidSource(src) && (
            <source 
              srcSet={src.replace(/\.(jpg|jpeg|png)$/, '.webp')} 
              type="image/webp" 
            />
          )}
          <img
            src={getImageSource()}
            alt={alt}
            className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
            style={{ objectFit }}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
            width={width}
            height={height}
          />
        </picture>
      )}
    </div>
  );
};
