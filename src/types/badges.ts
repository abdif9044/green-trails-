export type BadgeCategory = 
  | 'distance' 
  | 'trails' 
  | 'elevation' 
  | 'social' 
  | 'streak';

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  icon: string;
  level: 1 | 2 | 3;
  requirement: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  unlockedAt?: Date;
}

export interface BadgeProgress {
  userId: string;
  badgeId: string;
  progress: number;
  unlocked: boolean;
  unlockedAt?: string;
}
