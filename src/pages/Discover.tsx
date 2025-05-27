
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrailFilters } from '@/types/trails';
import { supabase } from '@/integrations/supabase/client';
import DiscoverHeader from '@/components/discover/DiscoverHeader';
import DiscoverFilters from '@/components/discover/DiscoverFilters';
import DiscoverTrailsList from '@/components/discover/DiscoverTrailsList';
import DiscoverViewControls from '@/components/discover/DiscoverViewControls';
import { TrailStatsOverview } from '@/components/discover/TrailStatsOverview';
import { Separator } from '@/components/ui/separator';
import DiscoverRedirect from './DiscoverRedirect';

const Discover: React.FC = () => {
  const navigate = useNavigate();
  const [currentFilters, setCurrentFilters] = useState<TrailFilters>({});
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showTrailPaths, setShowTrailPaths] = useState(false);
  const [trailCount, setTrailCount] = useState(0);
  const [totalTrails, setTotalTrails] = useState(0);
  const [isCheckingTrails, setIsCheckingTrails] = useState(true);

  // Check total trail count on mount
  useEffect(() => {
    const checkTrailCount = async () => {
      try {
        const { count, error } = await supabase
          .from('trails')
          .select('*', { count: 'exact', head: true });
        
        if (!error && count !== null) {
          setTotalTrails(count);
        }
      } catch (error) {
        console.error('Error checking trail count:', error);
      } finally {
        setIsCheckingTrails(false);
      }
    };

    checkTrailCount();
  }, []);

  // Redirect to auto-import if we have very few trails
  if (isCheckingTrails) {
    return <DiscoverRedirect />;
  }

  if (totalTrails < 1000) {
    return <DiscoverRedirect />;
  }

  const handleFiltersChange = (newFilters: TrailFilters) => {
    setCurrentFilters(newFilters);
  };

  const handleResetFilters = () => {
    setCurrentFilters({});
  };

  const handleTrailCountChange = (count: number) => {
    setTrailCount(count);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <DiscoverHeader trailCount={trailCount} />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <DiscoverFilters 
                onFiltersChange={handleFiltersChange}
                currentFilters={currentFilters}
              />
              
              <Separator />
              
              <TrailStatsOverview count={trailCount} />
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <DiscoverViewControls
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                showTrailPaths={showTrailPaths}
                resultsCount={trailCount}
              />
              
              <DiscoverTrailsList
                currentFilters={currentFilters}
                viewMode={viewMode}
                showTrailPaths={showTrailPaths}
                onTrailCountChange={handleTrailCountChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;
