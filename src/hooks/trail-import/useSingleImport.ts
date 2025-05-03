
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useSingleImport(reloadData: () => void) {
  const [importLoading, setImportLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Function to start a single source import
  const handleImport = async (sourceId: string) => {
    if (importLoading[sourceId]) return;
    
    setImportLoading(prev => ({ ...prev, [sourceId]: true }));
    try {
      // Call the import-trails edge function
      const response = await supabase.functions.invoke('import-trails', {
        body: { sourceId }
      });
      
      if (response.error) throw new Error(response.error.message);
      
      toast({
        title: "Import started",
        description: "The trail import process has been started successfully.",
      });
      
      // Refresh the import jobs list
      reloadData();
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import error",
        description: "Failed to start the trail import process.",
        variant: "destructive",
      });
    } finally {
      setImportLoading(prev => ({ ...prev, [sourceId]: false }));
    }
  };

  return {
    importLoading,
    handleImport
  };
}
