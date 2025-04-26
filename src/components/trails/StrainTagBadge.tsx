
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { StrainTag } from '@/types/trails';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface StrainTagBadgeProps {
  strain: StrainTag;
  size?: 'sm' | 'md' | 'lg';
}

const StrainTagBadge: React.FC<StrainTagBadgeProps> = ({ strain, size = 'md' }) => {
  const getTypeColor = (type: 'sativa' | 'indica' | 'hybrid') => {
    switch (type) {
      case 'sativa':
        return 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200';
      case 'indica':
        return 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200';
      case 'hybrid':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200';
    }
  };
  
  const getSizeClass = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return 'text-xs py-0 px-2';
      case 'lg':
        return 'text-sm py-1 px-3';
      default:
        return 'text-xs py-0.5 px-2.5';
    }
  };
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge 
          variant="outline" 
          className={`
            cursor-help font-medium border
            ${getTypeColor(strain.type)}
            ${getSizeClass(size)}
          `}
        >
          {strain.name}
        </Badge>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-1">
          <p className="font-semibold">{strain.name}</p>
          <p className="text-xs capitalize">{strain.type}</p>
          {strain.description && (
            <p className="text-xs mt-1">{strain.description}</p>
          )}
          {strain.effects?.length > 0 && (
            <div className="text-xs">
              <span className="font-medium">Effects: </span>
              {strain.effects.join(', ')}
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default StrainTagBadge;
