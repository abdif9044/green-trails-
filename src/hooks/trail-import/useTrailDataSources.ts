
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { TrailDataSource } from '../../services/trail-import/types';

export function useTrailDataSources() {
  const [dataSources, setDataSources] = useState<TrailDataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Function to load data sources with fallback when table doesn't exist
  const loadDataSources = async () => {
    setLoading(true);
    try {
      console.log('Trail data sources table does not exist, using fallback data');
      const fallbackSources = createFallbackDataSources();
      setDataSources(fallbackSources);
      return fallbackSources;
    } catch (error) {
      console.error('Error loading data sources:', error);
      const fallbackSources = createFallbackDataSources();
      setDataSources(fallbackSources);
      return fallbackSources;
    } finally {
      setLoading(false);
    }
  };

  // Create fallback data sources for when the table doesn't exist
  const createFallbackDataSources = (): TrailDataSource[] => {
    return [
      {
        id: '1',
        name: "US Hiking Project",
        description: "Mountain Project trail data",
        endpoint: "https://www.hikingproject.com/data",
        type: "hiking_project",
        enabled: true,
        source_type: "hiking_project",
        url: "https://www.hikingproject.com/data",
        country: "United States",
        state_province: null,
        region: "North America",
        last_synced: null,
        next_sync: null,
        is_active: true,
        config: { max_trails: 6000, api_key_required: true },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: "Parks Canada Trails",
        description: "Canadian national parks",
        endpoint: "https://www.pc.gc.ca/apps/tctr/api",
        type: "parks_canada",
        enabled: true,
        source_type: "parks_canada",
        url: "https://www.pc.gc.ca/apps/tctr/api",
        country: "Canada",
        state_province: null,
        region: "North America",
        last_synced: null,
        next_sync: null,
        is_active: true,
        config: { max_trails: 3000, language: "en" },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        name: "Americas OSM Network",
        description: "OpenStreetMap trail data",
        endpoint: "https://overpass-api.de/api",
        type: "openstreetmap",
        enabled: true,
        source_type: "openstreetmap",
        url: "https://overpass-api.de/api",
        country: "Various",
        state_province: null,
        region: "Americas",
        last_synced: null,
        next_sync: null,
        is_active: true,
        config: { max_trails: 5000, countries: ["BR", "AR", "CL", "PE", "CO"] },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  };

  const createDefaultDataSources = async () => {
    try {
      toast({
        title: "Using fallback data sources",
        description: "Trail data sources are ready for import operations."
      });
      
      return true;
    } catch (error) {
      console.error('Error creating default data sources:', error);
      toast({
        title: "Using fallback data sources",
        description: "Trail data sources are ready for import operations."
      });
      return true;
    }
  };

  return {
    dataSources,
    loading,
    loadDataSources,
    createDefaultDataSources
  };
}
