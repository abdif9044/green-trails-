
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
      // Fetch data sources
      const { data: sources, error: sourcesError } = await supabase
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

  return {
    dataSources,
    loading,
    loadDataSources,
  };
}
