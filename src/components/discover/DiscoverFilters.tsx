
import React from 'react';
import { TrailFilters } from '@/types/trails';
import SearchFilter from './filters/SearchFilter';
import DifficultyFilter from './filters/DifficultyFilter';
import LengthRangeFilter from './filters/LengthRangeFilter';
import LocationFilter from './filters/LocationFilter';
import TagsFilter from './filters/TagsFilter';
import FilterActions from './filters/FilterActions';

interface DiscoverFiltersProps {
  filters: TrailFilters;
  onFiltersChange: (filters: TrailFilters) => void;
  onReset: () => void;
  totalTrails: number;
  isLoading: boolean;
}

const DiscoverFilters: React.FC<DiscoverFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  totalTrails,
  isLoading
}) => {
  const updateFilter = (key: keyof TrailFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.searchQuery ||
      filters.difficulty ||
      (filters.lengthRange && (filters.lengthRange[0] > 0 || filters.lengthRange[1] < 50)) ||
      (filters.tags && filters.tags.length > 0) ||
      filters.country ||
      filters.stateProvince
    );
  };

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filter Trails
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {isLoading ? 'Loading...' : `${totalTrails} trails found`}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <SearchFilter
            value={filters.searchQuery || ''}
            onChange={(value) => updateFilter('searchQuery', value)}
          />
          
          <DifficultyFilter
            value={filters.difficulty || ''}
            onChange={(value) => updateFilter('difficulty', value)}
          />
          
          <LengthRangeFilter
            value={filters.lengthRange || [0, 50]}
            onChange={(value) => updateFilter('lengthRange', value)}
          />
        </div>

        <div className="space-y-4">
          <LocationFilter
            country={filters.country || ''}
            stateProvince={filters.stateProvince || ''}
            onCountryChange={(value) => updateFilter('country', value)}
            onStateProvinceChange={(value) => updateFilter('stateProvince', value)}
          />
          
          <TagsFilter
            value={filters.tags || []}
            onChange={(value) => updateFilter('tags', value)}
            availableTags={[
              'mountain views',
              'wildlife',
              'photography',
              'sunset views',
              'beach',
              'family friendly',
              'forest',
              'loop trail',
              'beginner friendly',
              'desert',
              'canyon',
              'challenging',
              'meadows',
              'wildflowers',
              'scenic views'
            ]}
          />
        </div>
      </div>

      {hasActiveFilters() && (
        <FilterActions onReset={onReset} />
      )}
    </div>
  );
};

export default DiscoverFilters;
