
import { useTrailStats } from '@/hooks/use-trail-stats';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Users, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface TrailStatsProps {
  trailId: string;
  className?: string;
}

const TrailStats = ({ trailId, className }: TrailStatsProps) => {
  const { data: stats, isLoading, error } = useTrailStats(trailId);

  if (error) {
    return (
      <div className="text-destructive p-4 text-center rounded-lg bg-destructive/10">
        Error loading trail statistics
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-4">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      <Card>
        <CardContent className="pt-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-greentrail-600" />
          <div>
            <p className="text-sm text-muted-foreground">Visitors</p>
            <p className="text-xl font-semibold">{stats.visits}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-4 flex items-center gap-2">
          <Star className="h-4 w-4 text-greentrail-600" />
          <div>
            <p className="text-sm text-muted-foreground">Average Rating</p>
            <p className="text-xl font-semibold">
              {stats.avgRating.toFixed(1)} ({stats.totalRatings})
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-4 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-greentrail-600" />
          <div>
            <p className="text-sm text-muted-foreground">Likes</p>
            <p className="text-xl font-semibold">{stats.likes}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrailStats;
