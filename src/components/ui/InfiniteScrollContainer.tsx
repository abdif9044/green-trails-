
import React, { ReactNode } from 'react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollContainerProps {
  children: ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  className?: string;
}

export function InfiniteScrollContainer({
  children,
  onLoadMore,
  hasMore,
  isLoading,
  className = ''
}: InfiniteScrollContainerProps) {
  const { ref, resetFetching } = useInfiniteScroll(() => {
    if (hasMore && !isLoading) {
      onLoadMore();
    }
  });

  React.useEffect(() => {
    if (!isLoading) {
      resetFetching();
    }
  }, [isLoading, resetFetching]);

  return (
    <div className={className}>
      {children}
      
      {hasMore && (
        <div ref={ref} className="flex justify-center p-4">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-greentrail-600" />
              <span className="text-sm text-muted-foreground">Loading more trails...</span>
            </div>
          ) : (
            <div className="h-4" /> // Spacer for intersection observer
          )}
        </div>
      )}
    </div>
  );
}
