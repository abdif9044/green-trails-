
import * as React from 'react';
import { useEasterEggs } from '@/contexts/easter-eggs-context';

interface CatModeImageProps {
  src?: string;
  alt?: string;
  className?: string;
  fallbackCat?: string;
}

const CAT_IMAGES = [
  'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=400&h=300&fit=crop',
];

const CatModeImage: React.FC<CatModeImageProps> = ({
  src,
  alt = "Trail image",
  className = "",
  fallbackCat
}) => {
  const { isCatMode } = useEasterEggs();

  if (isCatMode) {
    const randomCat = fallbackCat || CAT_IMAGES[Math.floor(Math.random() * CAT_IMAGES.length)];
    return (
      <img
        src={randomCat}
        alt={`🐱 ${alt} (Cat Mode Active!)`}
        className={`${className} transition-all duration-300`}
        title="Cat Mode is active! 🐱"
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
    />
  );
};

export default CatModeImage;
