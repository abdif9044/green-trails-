
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import DataSourcesTab from '@/components/admin/DataSourcesTab';
import ImportJobsTab from '@/components/admin/ImportJobsTab';
import BulkImportJobsTab from '@/components/admin/BulkImportJobsTab';
import { TrailDataSource, ImportJob, BulkImportJob } from '@/hooks/useTrailImport';

interface ImportTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  dataSources: TrailDataSource[];
  importJobs: ImportJob[];
  bulkImportJobs: BulkImportJob[];
  loading: boolean;
  importLoading: Record<string, boolean>;
  handleImport: (sourceId: string) => Promise<void>;
  getSourceNameById: (sourceId: string) => string;
  selectAllSources: () => void;
  deselectAllSources: () => void;
}

const ImportTabs: React.FC<ImportTabsProps> = ({
  activeTab,
  setActiveTab,
  dataSources,
  importJobs,
  bulkImportJobs,
  loading,
  importLoading,
  handleImport,
  getSourceNameById,
  selectAllSources,
  deselectAllSources,
}) => {
  return (
    <Tabs defaultValue="bulk" className="mt-6" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 w-full max-w-md">
        <TabsTrigger value="sources">Data Sources</TabsTrigger>
        <TabsTrigger value="jobs">Import Jobs</TabsTrigger>
        <TabsTrigger value="bulk">Bulk Jobs</TabsTrigger>
      </TabsList>
      
      <TabsContent value="sources" className="mt-4">
        <div className="mb-4 flex justify-end space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={selectAllSources}
          >
            Select All Sources
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={deselectAllSources}
          >
            Deselect All
          </Button>
        </div>
        <DataSourcesTab 
          dataSources={dataSources}
          loading={loading}
          importLoading={importLoading}
          onImport={handleImport}
        />
      </TabsContent>
      
      <TabsContent value="jobs" className="mt-4">
        <ImportJobsTab 
          importJobs={importJobs}
          loading={loading}
          getSourceNameById={getSourceNameById}
        />
      </TabsContent>
      
      <TabsContent value="bulk" className="mt-4">
        <BulkImportJobsTab 
          bulkImportJobs={bulkImportJobs}
          loading={loading}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ImportTabs;
