
import React, { useState } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOProvider from '@/components/SEOProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TrailCard from '@/components/ui/TrailCard';
import { InfiniteScrollContainer } from '@/components/ui/InfiniteScrollContainer';
import { usePaginatedTrails } from '@/hooks/usePaginatedTrails';
import { TrailFilters } from '@/types/trails';

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TrailFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const { trails, loading, hasMore, totalCount, loadMore } = usePaginatedTrails(filters);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, searchQuery: searchQuery.trim() || undefined }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOProvider 
        title="Discover Trails - GreenTrails"
        description="Explore amazing hiking trails and outdoor adventures. Find your perfect trail based on difficulty, location, and more."
      />
      
      <Navbar />
      
      <main className="flex-grow bg-slate-50 dark:bg-greentrail-950">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-4">
              Discover Amazing Trails
            </h1>
            <p className="text-lg text-greentrail-600 dark:text-greentrail-400 max-w-2xl mx-auto">
              Explore thousands of hiking trails and outdoor adventures. Find your perfect path to nature.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search trails by name, location, or features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" variant="default" className="bg-greentrail-600 hover:bg-greentrail-700">
                Search
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </form>

            {/* Quick filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filters.difficulty === 'easy' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  difficulty: prev.difficulty === 'easy' ? undefined : 'easy' 
                }))}
                className="text-xs"
              >
                Easy
              </Button>
              <Button
                variant={filters.difficulty === 'moderate' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  difficulty: prev.difficulty === 'moderate' ? undefined : 'moderate' 
                }))}
                className="text-xs"
              >
                Moderate
              </Button>
              <Button
                variant={filters.difficulty === 'hard' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  difficulty: prev.difficulty === 'hard' ? undefined : 'hard' 
                }))}
                className="text-xs"
              >
                Hard
              </Button>
              {(filters.searchQuery || filters.difficulty) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Results count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {loading ? 'Searching...' : `Found ${totalCount} trails`}
            </p>
          </div>

          {/* Trail Grid with Infinite Scroll */}
          <InfiniteScrollContainer
            onLoadMore={loadMore}
            hasMore={hasMore}
            isLoading={loading}
            className="space-y-6"
          >
            {trails.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {trails.map((trail) => (
                  <TrailCard 
                    key={trail.id} 
                    trail={trail}
                    showLikeButton={true}
                  />
                ))}
              </div>
            ) : !loading ? (
              <div className="text-center py-12">
                <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No trails found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search criteria or explore different areas.
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            ) : null}
          </InfiniteScrollContainer>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Discover;
