
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDownUp } from 'lucide-react';
import BulkImportDialog from '@/components/admin/BulkImportDialog';
import { TrailDataSource } from '@/hooks/useTrailImport';

interface ImportHeaderProps {
  bulkImportOpen: boolean;
  setBulkImportOpen: (open: boolean) => void;
  selectedSources: string[];
  onSourceSelect: (sourceId: string) => void;
  trailCount: number;
  onTrailCountChange: (count: number) => void;
  onBulkImport: () => Promise<void>;
  bulkImportLoading: boolean;
  dataSources: TrailDataSource[];
  loadData: () => void;
}

const ImportHeader: React.FC<ImportHeaderProps> = ({
  bulkImportOpen,
  setBulkImportOpen,
  selectedSources,
  onSourceSelect,
  trailCount,
  onTrailCountChange,
  onBulkImport,
  bulkImportLoading,
  dataSources,
  loadData,
}) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-greentrail-800 dark:text-greentrail-200">
          Trail Data Import
        </h1>
        <p className="text-greentrail-600 dark:text-greentrail-400">
          Import and manage trail data from various sources
        </p>
      </div>
      
      <div className="flex items-center mt-4 lg:mt-0 space-x-4">
        <BulkImportDialog
          open={bulkImportOpen}
          onOpenChange={setBulkImportOpen}
          dataSources={dataSources}
          selectedSources={selectedSources}
          onSourceSelect={onSourceSelect}
          trailCount={trailCount}
          onTrailCountChange={onTrailCountChange}
          onBulkImport={onBulkImport}
          loading={bulkImportLoading}
        />
        
        <Button 
          variant="outline" 
          onClick={loadData} 
          className="gap-2"
        >
          <ArrowDownUp className="h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default ImportHeader;
