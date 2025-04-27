
import { useTrailStats } from '@/hooks/use-trail-stats';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Users, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrailStatsProps {
  trailId: string;
  className?: string;
}

const TrailStats = ({ trailId, className }: TrailStatsProps) => {
  const { data: stats, isLoading } = useTrailStats(trailId);

  if (isLoading || !stats) {
    return null;
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      <Card>
        <CardContent className="pt-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-greentrail-600" />
          <div>
            <p className="text-sm text-muted-foreground">Visitors</p>
            <p className="text-xl font-semibold">{stats.visit_count}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-4 flex items-center gap-2">
          <Star className="h-4 w-4 text-greentrail-600" />
          <div>
            <p className="text-sm text-muted-foreground">Average Rating</p>
            <p className="text-xl font-semibold">
              {stats.avg_rating.toFixed(1)} ({stats.rating_count})
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-4 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-greentrail-600" />
          <div>
            <p className="text-sm text-muted-foreground">Comments</p>
            <p className="text-xl font-semibold">{stats.comment_count}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrailStats;
