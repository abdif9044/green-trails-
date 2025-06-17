
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TrailDataSource {
  id: string;
  name: string;
  source_type: string;
  url: string | null;
  country: string | null;
  state_province: string | null;
  region: string | null;
  last_synced: string | null;
  next_sync: string | null;
  is_active: boolean;
  config: any;
  created_at: string;
  updated_at: string;
}

export function useTrailDataSources() {
  const [dataSources, setDataSources] = useState<TrailDataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Function to load data sources with fallback when table doesn't exist
  const loadDataSources = async () => {
    setLoading(true);
    try {
      // Since trail_data_sources table doesn't exist, use fallback data
      console.log('Trail data sources table does not exist, using fallback data');
      const fallbackSources = createFallbackDataSources();
      setDataSources(fallbackSources);
      return fallbackSources;
    } catch (error) {
      console.error('Error loading data sources:', error);
      // Use fallback data sources if any error occurs
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

  // Function to create default data sources (placeholder implementation)
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
