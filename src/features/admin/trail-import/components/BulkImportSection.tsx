
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Database, Loader2 } from 'lucide-react';
import BulkImportDialog from '@/components/admin/BulkImportDialog';
import { TrailDataSource } from '@/hooks/useTrailImport';

interface BulkImportSectionProps {
  bulkImportOpen: boolean;
  setBulkImportOpen: (open: boolean) => void;
  selectedSources: string[];
  dataSources: TrailDataSource[];
  onSourceSelect: (sourceId: string) => void;
  trailCount: number;
  onTrailCountChange: (count: number) => void;
  onBulkImport: () => Promise<void>;
  bulkImportLoading: boolean;
  activeBulkJobId: string | null;
  bulkProgress: number;
}

const BulkImportSection: React.FC<BulkImportSectionProps> = ({
  bulkImportOpen,
  setBulkImportOpen,
  selectedSources,
  dataSources,
  onSourceSelect,
  trailCount,
  onTrailCountChange,
  onBulkImport,
  bulkImportLoading,
  activeBulkJobId,
  bulkProgress,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-greentrail-700 dark:text-greentrail-300">
          Bulk Trail Import
        </h2>
        
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
      </div>
      
      {activeBulkJobId && (
        <div className="bg-white dark:bg-greentrail-800 rounded-lg p-4 border border-greentrail-200 dark:border-greentrail-700 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">
              Bulk Import in Progress
            </span>
            <span className="text-sm font-medium">
              {bulkProgress}%
            </span>
          </div>
          <Progress value={bulkProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Importing trails in background. You can continue using the application.
          </p>
        </div>
      )}
    </div>
  );
};

export default BulkImportSection;
