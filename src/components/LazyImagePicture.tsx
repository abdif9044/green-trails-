
import React from "react";
import { isValidImageSource } from "@/utils/image-validators";

interface LazyImagePictureProps {
  src: string;
  alt: string;
  className: string;
  isLoaded: boolean;
  objectFit: "cover" | "contain" | "fill" | "none" | "scale-down";
  width?: string | number;
  height?: string | number;
  supportsWebP: boolean;
  onLoad: () => void;
  onError: () => void;
}

export const LazyImagePicture: React.FC<LazyImagePictureProps> = ({
  src,
  alt,
  className,
  isLoaded,
  objectFit,
  width,
  height,
  supportsWebP,
  onLoad,
  onError
}) => {
  return (
    <picture>
      {supportsWebP && isValidImageSource(src) && (
        <source 
          srcSet={src.replace(/\.(jpg|jpeg|png)$/, '.webp')} 
          type="image/webp" 
        />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        style={{ objectFit }}
        onLoad={onLoad}
        onError={onError}
        loading="lazy"
        width={width}
        height={height}
      />
    </picture>
  );
};
