
import { useState } from 'react';
import { TrailDataSource } from '@/hooks/useTrailImport';

export function useSourceSelection(dataSources: TrailDataSource[]) {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  const handleSourceSelect = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId) 
        : [...prev, sourceId]
    );
  };

  const getSourceNameById = (sourceId: string): string => {
    const source = dataSources.find(src => src.id === sourceId);
    return source ? source.name : 'Unknown Source';
  };

  const selectAllSources = () => {
    const activeSources = dataSources.filter(s => s.is_active).map(s => s.id);
    setSelectedSources(activeSources);
  };

  const deselectAllSources = () => {
    setSelectedSources([]);
  };

  return {
    selectedSources,
    setSelectedSources,
    handleSourceSelect,
    getSourceNameById,
    selectAllSources,
    deselectAllSources
  };
}
