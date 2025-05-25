
import React from 'react';
import { useTrailsQuery } from "@/features/trails/hooks/use-trails-query";
import { TrailFilters } from '@/types/trails';
import NoTrailsFound from './NoTrailsFound';
import TrailsGrid from './TrailsGrid';
import TrailMap from '@/components/map/TrailMap';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface DiscoverTrailsListProps {
  currentFilters: TrailFilters;
  viewMode: 'list' | 'map';
  showTrailPaths?: boolean;
  onTrailCountChange?: (count: number) => void;
  onTrailSelect?: (trailId: string) => void;
}

const DiscoverTrailsList: React.FC<DiscoverTrailsListProps> = ({ 
  currentFilters, 
  viewMode,
  showTrailPaths = false,
  onTrailCountChange,
  onTrailSelect
}) => {
  const { data, isLoading, error } = useTrailsQuery(currentFilters);
  
  const trails = data?.data || [];
  const totalCount = data?.count || 0;

  React.useEffect(() => {
    if (onTrailCountChange) {
      onTrailCountChange(totalCount);
    }
  }, [totalCount, onTrailCountChange]);

  const handleResetFilters = () => {
    // This would be handled by the parent component
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (trails.length === 0) {
    return <NoTrailsFound onResetFilters={handleResetFilters} />;
  }

  return (
    <>
      {viewMode === 'list' ? (
        <TrailsGrid trails={trails} />
      ) : (
        <div className="h-[600px] lg:h-[700px]">
          <TrailMap 
            trails={trails} 
            showTrailPaths={showTrailPaths}
            onTrailSelect={onTrailSelect}
            country={currentFilters.country}
            stateProvince={currentFilters.stateProvince}
            difficulty={currentFilters.difficulty}
          />
        </div>
      )}
    </>
  );
};

export default DiscoverTrailsList;
