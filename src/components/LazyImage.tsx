
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
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = "",
  width,
  height,
  placeholderSrc = "/placeholder.svg",
  onLoad,
  fallbackImage = "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset states when src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  // Set up the intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "100px",
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
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
    setHasError(true);
    console.warn(`Image failed to load: ${src}`);
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

  // Get actual image source to display
  const getImageSource = () => {
    if (hasError) return fallbackImage;
    if (!isInView) return placeholderSrc;
    return src;
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
          {supportsWebP && !hasError && (
            <source 
              srcSet={src.replace(/\.(jpg|jpeg|png)$/, '.webp')} 
              type="image/webp" 
            />
          )}
          <img
            src={getImageSource()}
            alt={alt}
            className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 object-cover`}
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
