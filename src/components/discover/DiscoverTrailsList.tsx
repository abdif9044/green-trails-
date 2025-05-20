
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
  const { 
    trails, 
    loading, 
    totalCount, 
    page, 
    pageSize, 
    changePage 
  } = useTrailsQuery(currentFilters, onTrailCountChange);

  const handleResetFilters = () => {
    // This would be handled by the parent component
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  // Pagination UI
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex items-center justify-center mt-8 gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => changePage(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-1">
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            let pageNum: number;
            
            // Logic to show relevant page numbers
            if (totalPages <= 5) {
              // If we have 5 or fewer pages, show all
              pageNum = i + 1;
            } else if (page <= 3) {
              // At the start, show 1-5
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              // At the end, show last 5 pages
              pageNum = totalPages - 4 + i;
            } else {
              // In the middle, show current page and 2 on each side
              pageNum = page - 2 + i;
            }
            
            return (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                size="sm"
                onClick={() => changePage(pageNum)}
                className="w-10"
              >
                {pageNum}
              </Button>
            );
          })}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => changePage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  if (loading) {
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
        <>
          <TrailsGrid trails={trails} />
          {renderPagination()}
        </>
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
