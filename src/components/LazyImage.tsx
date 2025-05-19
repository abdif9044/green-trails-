
import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon } from "lucide-react";
import { isValidImageSource, getNatureFallbackImage } from "@/utils/image-validators";
import { NATURE_IMAGES } from "@/utils/image-constants";
import { useLazyLoad } from "@/hooks/use-lazy-load";
import { useWebPSupport } from "@/hooks/use-webp-support";

export interface LazyImageProps {
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
  const [hasError, setHasError] = useState(false);
  const { isInView, elementRef } = useLazyLoad();
  const supportsWebP = useWebPSupport();
  
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

  // Style for the container to prevent layout shifts
  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: width ? (typeof width === 'number' ? `${width}px` : width) : "100%",
    height: height ? (typeof height === 'number' ? `${height}px` : height) : "auto",
    overflow: "hidden",
  };

  // Get actual image source to display
  const getImageSource = () => {
    // If not in view yet, use placeholder
    if (!isInView) return placeholderSrc;
    
    // If we've already detected an error or the source is invalid, use fallback
    if (hasError || !isValidImageSource(src)) {
      return getNatureFallbackImage(alt, fallbackImage);
    }
    
    // Source is valid and we're in view
    return src;
  };

  return (
    <div style={containerStyle} ref={elementRef}>
      {!isLoaded && <Skeleton className="absolute inset-0" />}
      
      {(hasError || !isValidImageSource(src)) && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      
      {isInView && (
        <picture>
          {supportsWebP && isValidImageSource(src) && (
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
