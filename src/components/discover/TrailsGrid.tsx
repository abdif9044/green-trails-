
import React from 'react';
import { Trail } from '@/types/trails';
import TrailCard from '@/features/trails/components/TrailCard';
import { Loader2 } from 'lucide-react';

interface TrailsGridProps {
  trails: Trail[];
  isLoading?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
}

const TrailsGrid: React.FC<TrailsGridProps> = ({
  trails,
  isLoading = false,
  hasNextPage = false,
  onLoadMore
}) => {
  if (isLoading && trails.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-greentrail-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trails.map((trail) => (
          <TrailCard
            key={trail.id}
            trail={trail}
          />
        ))}
      </div>

      {hasNextPage && onLoadMore && (
        <div className="flex justify-center pt-6">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-6 py-2 bg-greentrail-600 text-white rounded-lg hover:bg-greentrail-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Load More Trails
          </button>
        </div>
      )}
    </div>
  );
};

export default TrailsGrid;
