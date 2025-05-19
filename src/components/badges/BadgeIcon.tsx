
import React from 'react';
import { 
  Award, 
  Flag, 
  Compass, 
  Map, 
  Mountain, 
  Users, 
  Calendar, 
  Flame, 
  Star,
  Leaf,
  BadgeCheck,
  Hiking
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgeIconProps {
  icon: string;
  size?: number;
  className?: string;
  locked?: boolean;
}

export const BadgeIcon: React.FC<BadgeIconProps> = ({ 
  icon, 
  size = 24, 
  className = "", 
  locked = false 
}) => {
  const iconClasses = cn(
    "transition-colors", 
    locked ? "text-gray-400 dark:text-gray-600" : "text-greentrail-600 dark:text-greentrail-400",
    className
  );

  const iconProps = {
    size,
    className: iconClasses
  };

  switch (icon) {
    case 'award':
      return <Award {...iconProps} />;
    case 'flag':
      return <Flag {...iconProps} />;
    case 'compass':
      return <Compass {...iconProps} />;
    case 'map':
      return <Map {...iconProps} />;
    case 'mountain':
      return <Mountain {...iconProps} />;
    case 'users':
      return <Users {...iconProps} />;
    case 'calendar':
      return <Calendar {...iconProps} />;
    case 'flame':
      return <Flame {...iconProps} />;
    case 'star':
      return <Star {...iconProps} />;
    case 'leaf':
      return <Leaf {...iconProps} />;
    case 'badge':
      return <BadgeCheck {...iconProps} />;
    case 'hiking':
      return <Mountain {...iconProps} />;
    default:
      return <Award {...iconProps} />;
  }
};
