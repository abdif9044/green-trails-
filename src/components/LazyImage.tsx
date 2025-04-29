
import React, { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  placeholderSrc?: string;
  onLoad?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = "",
  width,
  height,
  placeholderSrc = "/placeholder.svg",
  onLoad,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

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

  // Function to get the right image source based on WebP support
  const getImageSource = () => {
    if (supportsWebP === null) return src; // Still checking
    if (supportsWebP && src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png')) {
      // Only try to convert standard image formats to WebP
      const webPSrc = src.replace(/\.(jpg|jpeg|png)$/, '.webp');
      return webPSrc;
    }
    return src;
  };

  return (
    <div style={containerStyle} ref={imgRef}>
      {!isLoaded && <Skeleton className="absolute inset-0" />}
      
      {isInView && (
        <picture>
          {supportsWebP && (
            <source 
              srcSet={getImageSource()} 
              type="image/webp" 
            />
          )}
          <img
            src={isInView ? src : placeholderSrc}
            alt={alt}
            className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
            onLoad={handleLoad}
            loading="lazy"
            width={width}
            height={height}
          />
        </picture>
      )}
    </div>
  );
};
