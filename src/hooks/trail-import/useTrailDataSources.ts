
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TrailDataSource } from '../useTrailImport';

export function useTrailDataSources() {
  const [dataSources, setDataSources] = useState<TrailDataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Function to load data sources
  const loadDataSources = async () => {
    setLoading(true);
    try {
      // Fetch data sources using type casting to work around missing types
      const { data: sources, error: sourcesError } = await (supabase as any)
        .from("trail_data_sources")
        .select("*")
        .order("last_synced", { ascending: false });
        
      if (sourcesError) throw sourcesError;
      
      setDataSources(sources || []);
      return sources || [];
    } catch (error) {
      console.error('Error loading data sources:', error);
      toast({
        title: "Error loading data",
        description: "Failed to load trail import data sources. Please try again.",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Function to create default data sources if none exist
  const createDefaultDataSources = async () => {
    try {
      const defaultSources = [
        {
          name: "US National Parks Trails",
          source_type: "usgs",
          url: "https://trails-api.usgs.gov",
          country: "United States",
          state_province: null,
          region: "National",
          is_active: true,
          config: { format: "geojson" }
        },
        {
          name: "California Trails",
          source_type: "overpass",
          url: "https://overpass-api.org",
          country: "United States",
          state_province: "California",
          region: "West",
          is_active: true,
          config: { format: "geojson" }
        },
        {
          name: "Canada Parks Trails",
          source_type: "canada_parks",
          url: "https://parks-canada.api.gov",
          country: "Canada",
          state_province: null,
          region: "National",
          is_active: true,
          config: { format: "geojson" }
        }
      ];

      const { error } = await (supabase as any)
        .from("trail_data_sources")
        .insert(defaultSources);
        
      if (error) {
        console.error('Error creating default data sources:', error);
        toast({
          title: "Error creating data sources",
          description: "Failed to create default trail data sources.",
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Default data sources created",
        description: "Created default trail data sources for import."
      });
      
      return true;
    } catch (error) {
      console.error('Error creating default data sources:', error);
      toast({
        title: "Error creating data sources",
        description: "Failed to create default trail data sources.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    dataSources,
    loading,
    loadDataSources,
    createDefaultDataSources
  };
}
