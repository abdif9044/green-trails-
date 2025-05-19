
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Stat {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
}

interface ProfileStatsCardProps {
  stats: Stat[];
  loading?: boolean;
  className?: string;
}

export const ProfileStatsCard: React.FC<ProfileStatsCardProps> = ({ 
  stats, 
  loading = false,
  className 
}) => {
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Stats at a Glance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center mb-1">
                {stat.icon && <span className="mr-2">{stat.icon}</span>}
                <span className="text-2xl font-bold text-greentrail-700 dark:text-greentrail-300">
                  {stat.value}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
