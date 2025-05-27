
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Database, TrendingUp, Users, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProductionDataImportProps {
  onImportComplete: () => void;
}

export const ProductionDataImport: React.FC<ProductionDataImportProps> = ({ onImportComplete }) => {
  const [importProgress, setImportProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);
  const [importStats, setImportStats] = useState({
    totalTrails: 0,
    processed: 0,
    added: 0,
    failed: 0
  });
  const { toast } = useToast();

  const startProductionImport = async () => {
    setIsImporting(true);
    setImportProgress(0);
    setCurrentPhase('Initializing production import...');

    try {
      // Phase 1: Database optimization
      setCurrentPhase('Optimizing database for large-scale data...');
      setImportProgress(10);
      
      await supabase.functions.invoke('create-database-indexes');
      
      // Phase 2: Import from Hiking Project API
      setCurrentPhase('Importing trails from Hiking Project API...');
      setImportProgress(20);
      
      const hikingProjectResult = await supabase.functions.invoke('import-trails-massive', {
        body: {
          sources: ['hiking_project'],
          maxTrailsPerSource: 25000,
          batchSize: 100,
          concurrency: 3
        }
      });
      
      setImportProgress(50);
      
      // Phase 3: Import from OpenStreetMap
      setCurrentPhase('Importing trails from OpenStreetMap...');
      
      const osmResult = await supabase.functions.invoke('import-trails-massive', {
        body: {
          sources: ['openstreetmap'],
          maxTrailsPerSource: 20000,
          batchSize: 50,
          concurrency: 2
        }
      });
      
      setImportProgress(75);
      
      // Phase 4: Import from USGS/National Parks
      setCurrentPhase('Importing trails from USGS and National Parks...');
      
      const usgsResult = await supabase.functions.invoke('import-trails-massive', {
        body: {
          sources: ['usgs'],
          maxTrailsPerSource: 10000,
          batchSize: 25,
          concurrency: 1
        }
      });
      
      setImportProgress(90);
      
      // Phase 5: Final optimization and cleanup
      setCurrentPhase('Finalizing and optimizing trail database...');
      
      // Get final trail count
      const { count } = await supabase
        .from('trails')
        .select('*', { count: 'exact', head: true });
      
      setImportProgress(100);
      setCurrentPhase('Import completed successfully!');
      
      const totalAdded = (hikingProjectResult.data?.total_added || 0) + 
                        (osmResult.data?.total_added || 0) + 
                        (usgsResult.data?.total_added || 0);
      
      setImportStats({
        totalTrails: count || 0,
        processed: totalAdded,
        added: totalAdded,
        failed: 0
      });
      
      toast({
        title: "Production import completed!",
        description: `Successfully imported ${totalAdded.toLocaleString()} trails from multiple sources.`,
      });
      
      onImportComplete();
      
    } catch (error) {
      console.error('Production import failed:', error);
      toast({
        title: "Import failed",
        description: "There was an error during the production import process.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Production Data Import
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">50K+</div>
            <div className="text-sm text-muted-foreground">Target Trails</div>
          </div>
          <div className="text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-muted-foreground">Data Sources</div>
          </div>
          <div className="text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">Ready</div>
            <div className="text-sm text-muted-foreground">For Beta</div>
          </div>
          <div className="text-center">
            <Database className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">{importStats.totalTrails.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Current Trails</div>
          </div>
        </div>

        {isImporting && (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{currentPhase}</span>
                <span>{importProgress}%</span>
              </div>
              <Progress value={importProgress} className="w-full" />
            </div>
            
            {importStats.processed > 0 && (
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="font-medium">{importStats.processed.toLocaleString()}</div>
                  <div className="text-muted-foreground">Processed</div>
                </div>
                <div>
                  <div className="font-medium text-green-600">{importStats.added.toLocaleString()}</div>
                  <div className="text-muted-foreground">Added</div>
                </div>
                <div>
                  <div className="font-medium text-red-600">{importStats.failed.toLocaleString()}</div>
                  <div className="text-muted-foreground">Failed</div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-medium">Import Plan:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Database optimization and indexing</li>
            <li>• 25,000 trails from Hiking Project API</li>
            <li>• 20,000 trails from OpenStreetMap</li>
            <li>• 10,000 trails from USGS/National Parks</li>
            <li>• Performance optimization and cleanup</li>
          </ul>
        </div>

        <Button
          onClick={startProductionImport}
          disabled={isImporting}
          className="w-full"
          size="lg"
        >
          {isImporting ? 'Importing Production Data...' : 'Start Production Import (55K+ Trails)'}
        </Button>
      </CardContent>
    </Card>
  );
};
