import React, { useState } from 'react';
import { Badge, BadgeCategory } from '@/types/badges';
import { BadgeCard } from './BadgeCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BadgesListProps {
  badges: Badge[];
  className?: string;
}

export const BadgesList: React.FC<BadgesListProps> = ({ badges, className }) => {
  const [filter, setFilter] = useState<BadgeCategory | 'all'>('all');
  
  const categories: { value: BadgeCategory | 'all', label: string }[] = [
    { value: 'all', label: 'All Badges' },
    { value: 'distance', label: 'Distance' },
    { value: 'trails', label: 'Trails' },
    { value: 'elevation', label: 'Elevation' },
    { value: 'social', label: 'Social' },
    { value: 'streak', label: 'Streaks' },
  ];

  const filteredBadges = filter === 'all' 
    ? badges 
    : badges.filter(badge => badge.category === filter);

  // Count unlocked badges for each category
  const unlockCounts = categories.map(category => {
    if (category.value === 'all') {
      return badges.filter(b => b.unlocked).length;
    }
    return badges.filter(b => b.category === category.value && b.unlocked).length;
  });

  const totalCounts = categories.map(category => {
    if (category.value === 'all') {
      return badges.length;
    }
    return badges.filter(b => b.category === category.value).length;
  });

  return (
    <div className={className}>
      <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as BadgeCategory | 'all')}>
        <TabsList className="grid grid-cols-4 md:grid-cols-7 mb-6">
          {categories.map((category, index) => (
            <TabsTrigger key={category.value} value={category.value} className="text-xs px-2">
              {category.label}
              <span className="ml-1 text-xs text-muted-foreground">
                {unlockCounts[index]}/{totalCounts[index]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category.value} value={category.value}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBadges
                .sort((a, b) => {
                  // Sort by unlocked status first
                  if (a.unlocked !== b.unlocked) {
                    return a.unlocked ? -1 : 1;
                  }
                  // Then sort by level
                  return a.level - b.level;
                })
                .map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
            </div>
            
            {filteredBadges.length === 0 && (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                No badges found for this category.
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
