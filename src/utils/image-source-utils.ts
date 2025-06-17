
import { isValidImageSource, getNatureFallbackImage } from './image-validators';
import { NATURE_IMAGES } from './image-constants';

export interface ImageSourceConfig {
  src: string;
  alt: string;
  placeholderSrc: string;
  fallbackImage: string;
  isInView: boolean;
  hasError: boolean;
}

export const getImageSource = ({
  src,
  alt,
  placeholderSrc,
  fallbackImage,
  isInView,
  hasError
}: ImageSourceConfig): string => {
  // If not in view yet, use placeholder
  if (!isInView) return placeholderSrc;
  
  // If we've already detected an error or the source is invalid, use fallback
  if (hasError || !isValidImageSource(src)) {
    return getNatureFallbackImage(alt, fallbackImage);
  }
  
  // Source is valid and we're in view
  return src;
};

export const createContainerStyle = (
  width?: string | number,
  height?: string | number
): React.CSSProperties => ({
  position: "relative",
  width: width ? (typeof width === 'number' ? `${width}px` : width) : "100%",
  height: height ? (typeof height === 'number' ? `${height}px` : height) : "auto",
  overflow: "hidden",
});
