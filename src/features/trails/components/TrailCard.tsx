
import React from 'react';
import { Heart, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { StrainTag, TrailDifficulty } from '@/types/trails';
import { TrailDifficultyBadge } from './TrailDifficultyBadge';
import { TrailCardStats } from './TrailCardStats';
import { TrailTagsList } from './TrailTagsList';
import { LazyImage } from '@/components/LazyImage';
import { GlassCard } from '@/components/glass/GlassCard';

export interface TrailCardProps {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  difficulty: TrailDifficulty;
  length: number;
  elevation: number;
  tags: readonly string[] | string[];
  likes: number;
  strainTags?: string[] | StrainTag[];
  isAgeRestricted?: boolean;
}

// High-quality curated trail images by category
const TRAIL_FALLBACK_IMAGES = {
  forest: "https://images.unsplash.com/photo-1448375240586-882707db888b",
  mountain: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
  urban: "https://images.unsplash.com/photo-1507992781348-310259076fe0",
  desert: "https://images.unsplash.com/photo-1587223075055-82e9a937ddff",
  river: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb",
  park: "https://images.unsplash.com/photo-1568393691622-c7ba131d63b4",
  lake: "https://images.unsplash.com/photo-1544714042-5dc4f6a3c4ce",
  default: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
  hiking: "https://images.unsplash.com/photo-1551632811-561732d1e306",
  waterfall: "https://images.unsplash.com/photo-1546587348-d12660c30c50",
  valley: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5"
};

const TrailCard = ({
  id,
  name,
  location,
  imageUrl,
  difficulty,
  length,
  elevation,
  tags,
  likes,
  strainTags = [],
  isAgeRestricted = false
}: TrailCardProps) => {
  // Choose a more appropriate fallback image based on the trail tags
  const getFallbackImage = () => {
    if (!tags || tags.length === 0) return TRAIL_FALLBACK_IMAGES.default;
    
    // Check tags for relevant categories
    for (const tag of tags) {
      const tagLower = typeof tag === 'string' ? tag.toLowerCase() : '';
      if (tagLower in TRAIL_FALLBACK_IMAGES) {
        return TRAIL_FALLBACK_IMAGES[tagLower as keyof typeof TRAIL_FALLBACK_IMAGES];
      }
    }
    
    // If no matching tag is found, return default
    return TRAIL_FALLBACK_IMAGES.default;
  };

  // Add debug logging for trail routing
  const handleTrailClick = () => {
    console.log(`Navigating to trail: ${id}, name: ${name}`);
  };
  
  return (
    <GlassCard 
      className="overflow-hidden group"
      glassIntensity="medium"
      hoverable={true}
    >
      <Link to={`/trail/${id}`} onClick={handleTrailClick}>
        <div className="relative h-48 overflow-hidden">
          {/* Enhanced glass overlay on image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />
          
          <LazyImage 
            src={imageUrl} 
            alt={`${name} trail in ${location}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            fallbackImage={getFallbackImage()}
            objectFit="cover"
          />
          
          {/* Floating glass badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 z-20">
            <div className="bg-white/20 backdrop-blur-md rounded-lg border border-white/30 p-1">
              <TrailDifficultyBadge difficulty={difficulty} />
            </div>
            {isAgeRestricted && (
              <div className="bg-purple-500/20 backdrop-blur-md rounded-lg border border-purple-400/30 px-2 py-1">
                <Badge className="bg-transparent text-purple-100 border-0">21+</Badge>
              </div>
            )}
          </div>
        </div>
      </Link>
      
      {/* Content area with glass background */}
      <div className="relative p-4">
        {/* Subtle glass separator */}
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <div className="flex items-start justify-between">
          <div>
            <Link to={`/trail/${id}`} onClick={handleTrailClick}>
              <h3 className="font-bold text-greentrail-800 dark:text-greentrail-200 text-lg hover:text-greentrail-600 transition-colors duration-300">
                {name}
              </h3>
            </Link>
            <div className="flex items-center mt-1 text-sm text-greentrail-600 dark:text-greentrail-400">
              <MapPin size={14} className="mr-1" />
              <span>{location}</span>
            </div>
          </div>
          
          {/* Glass heart container */}
          <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-2 py-1 border border-white/20">
            <Heart size={16} className="mr-1 text-red-400" />
            <span className="text-sm font-medium">{likes}</span>
          </div>
        </div>
        
        <div className="mt-3">
          <TrailCardStats length={length} elevation={elevation} />
        </div>
      </div>
      
      {/* Tags with glass background */}
      <div className="px-4 pb-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10">
          <TrailTagsList tags={tags} />
        </div>
      </div>
    </GlassCard>
  );
};

export default TrailCard;
