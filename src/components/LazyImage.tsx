
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

const DEFAULT_TRAIL_IMAGE = "https://images.unsplash.com/photo-1469474968028-56623f02e42e";

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = "",
  width,
  height,
  placeholderSrc = "/placeholder.svg",
  onLoad,
  fallbackImage = DEFAULT_TRAIL_IMAGE,
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

  // Check if source is a valid URL or path
  const isValidSource = (source: string): boolean => {
    if (!source) return false;
    
    // More comprehensive check for valid paths
    try {
      // Try to create a URL - will throw if invalid
      new URL(source, window.location.origin);
      return true;
    } catch {
      // Check if it's a relative path at minimum
      return source.includes('/') || source.startsWith('blob:');
    }
  };

  // Get actual image source to display
  const getImageSource = () => {
    // If we've already detected an error, use fallback
    if (hasError) return fallbackImage;
    
    // If not in view yet, use placeholder
    if (!isInView) return placeholderSrc;
    
    // Validate source
    return isValidSource(src) ? src : fallbackImage;
  };

  return (
    <div style={containerStyle} ref={imgRef}>
      {!isLoaded && !hasError && <Skeleton className="absolute inset-0" />}
      
      {hasError && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      
      {isInView && (
        <picture>
          {supportsWebP && !hasError && isValidSource(src) && (
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
