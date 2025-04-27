
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAddRating, useTrailRatings } from '@/hooks/use-trail-ratings';
import { useAuth } from '@/hooks/use-auth';

interface TrailRatingProps {
  trailId: string;
  className?: string;
}

const TrailRating = ({ trailId, className }: TrailRatingProps) => {
  const { data: ratings } = useTrailRatings(trailId);
  const { mutate: addRating } = useAddRating(trailId);
  const { user } = useAuth();

  const avgRating = ratings?.length 
    ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
    : 0;

  const userRating = ratings?.find(r => r.user_id === user?.id)?.rating || 0;

  const handleRating = (rating: number) => {
    if (!user) return;
    addRating(rating);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          onClick={() => handleRating(rating)}
          className={cn(
            "transition-colors",
            !user && "cursor-not-allowed opacity-50"
          )}
          disabled={!user}
        >
          <Star
            className={cn(
              "h-6 w-6",
              rating <= (userRating || avgRating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            )}
          />
        </button>
      ))}
      <span className="text-sm text-muted-foreground">
        ({ratings?.length || 0} ratings)
      </span>
    </div>
  );
};

export default TrailRating;
