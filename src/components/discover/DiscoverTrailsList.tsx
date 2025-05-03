
import React from 'react';
import { useTrailsQuery } from "@/features/trails/hooks/use-trails-query";
import { TrailFilters } from '@/types/trails';
import NoTrailsFound from './NoTrailsFound';
import TrailsGrid from './TrailsGrid';

export interface DiscoverTrailsListProps {
  currentFilters: TrailFilters;
  viewMode: 'list' | 'map';
  onTrailCountChange?: (count: number) => void;
}

const DiscoverTrailsList: React.FC<DiscoverTrailsListProps> = ({ 
  currentFilters, 
  viewMode,
  onTrailCountChange
}) => {
  const { trails, loading } = useTrailsQuery(currentFilters, onTrailCountChange);

  const handleResetFilters = () => {
    // This would be handled by the parent component
  };

  if (loading) {
    return <div className="py-12 text-center">Loading trails...</div>;
  }

  if (trails.length === 0) {
    return <NoTrailsFound onResetFilters={handleResetFilters} />;
  }

  return <TrailsGrid trails={trails} />;
};

export default DiscoverTrailsList;
