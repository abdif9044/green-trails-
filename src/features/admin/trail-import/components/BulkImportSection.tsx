
import React from 'react';
import BulkImportProgressCard from '@/components/admin/BulkImportProgressCard';
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
  activeBulkJobId,
  bulkProgress
}) => {
  // Show progress card if there's an active bulk import job
  if (activeBulkJobId) {
    return <BulkImportProgressCard progress={bulkProgress} />;
  }
  
  return null;
};

export default BulkImportSection;
