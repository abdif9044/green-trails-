
import React from "react";
import { Trail } from "@/types/trails";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Heart, Share2 } from "lucide-react";

interface TrailDifficultyBadgeProps {
  difficulty: 'easy' | 'moderate' | 'hard';
}

const TrailDifficultyBadge: React.FC<TrailDifficultyBadgeProps> = ({ difficulty }) => {
  const getColorClass = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Badge variant="secondary" className={getColorClass(difficulty)}>
      {difficulty}
    </Badge>
  );
};

interface TrailHeaderProps {
  trail: Trail;
  onLike?: () => void;
  onShare?: () => void;
  isLiked?: boolean;
  likes?: number;
}

const TrailHeader: React.FC<TrailHeaderProps> = ({
  trail,
  onLike,
  onShare,
  isLiked = false,
  likes
}) => {
  const displayLikes = likes !== undefined ? likes : trail.likes;
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <TrailDifficultyBadge difficulty={trail.difficulty} />
            {trail.tags.slice(0, 3).map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            {trail.name}
          </h1>
          
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{trail.location}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={isLiked ? "default" : "outline"}
            size="sm"
            onClick={onLike}
            className="flex items-center gap-2"
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{displayLikes}</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrailHeader;
