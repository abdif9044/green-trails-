
import React from "react";
import { NATURE_IMAGES } from "@/utils/image-constants";
import { useLazyLoad } from "@/hooks/use-lazy-load";
import { useWebPSupport } from "@/hooks/use-webp-support";
import { useImageLoading } from "@/hooks/use-image-loading";
import { getImageSource, createContainerStyle } from "@/utils/image-source-utils";
import { LazyImageStates } from "./LazyImageStates";
import { LazyImagePicture } from "./LazyImagePicture";

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
  const { isInView, elementRef } = useLazyLoad();
  const supportsWebP = useWebPSupport();
  const { isLoaded, hasError, handleLoad, handleError } = useImageLoading({ src, onLoad });

  // Get the actual image source to display
  const imageSource = getImageSource({
    src,
    alt,
    placeholderSrc,
    fallbackImage,
    isInView,
    hasError
  });

  // Style for the container to prevent layout shifts
  const containerStyle = createContainerStyle(width, height);

  return (
    <div style={containerStyle} ref={elementRef}>
      <LazyImageStates 
        isLoaded={isLoaded}
        hasError={hasError}
        src={src}
      />
      
      {isInView && (
        <LazyImagePicture
          src={imageSource}
          alt={alt}
          className={className}
          isLoaded={isLoaded}
          objectFit={objectFit}
          width={width}
          height={height}
          supportsWebP={supportsWebP}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
};
