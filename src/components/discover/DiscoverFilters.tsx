
import React from 'react';
import { TrailFilters } from '@/types/trails';

export interface DiscoverFiltersProps {
  onFiltersChange: (filters: TrailFilters) => void;
  currentFilters?: TrailFilters;
}

const DiscoverFilters: React.FC<DiscoverFiltersProps> = ({ 
  onFiltersChange, 
  currentFilters = {} 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Filters</h3>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Search</label>
        <input
          type="text"
          placeholder="Search trails..."
          className="w-full px-3 py-2 border rounded-md"
          value={currentFilters.searchQuery || ''}
          onChange={(e) => onFiltersChange({ ...currentFilters, searchQuery: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Difficulty</label>
        <select
          className="w-full px-3 py-2 border rounded-md"
          value={currentFilters.difficulty || ''}
          onChange={(e) => onFiltersChange({ ...currentFilters, difficulty: e.target.value })}
        >
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="moderate">Moderate</option>
          <option value="hard">Hard</option>
          <option value="expert">Expert</option>
        </select>
      </div>
    </div>
  );
};

export default DiscoverFilters;
