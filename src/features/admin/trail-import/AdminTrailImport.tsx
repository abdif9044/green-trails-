
import React, { useEffect } from "react";
import { useTrailImport } from "@/hooks/useTrailImport";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOProvider from "@/components/SEOProvider";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

// Import refactored components
import { useDBSetup } from "./hooks/useDBSetup";
import { useBulkImport } from "./hooks/useBulkImport";
import { useAutoImport } from "./hooks/useAutoImport";
import { useSourceSelection } from "./hooks/useSourceSelection";
import DatabaseSetupAlerts from "./components/DatabaseSetupAlerts";
import ImportHeader from "./components/ImportHeader";
import BulkImportSection from "./components/BulkImportSection";
import ImportTabs from "./components/ImportTabs";

const AdminTrailImport = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState("bulk");
  
  const {
    dataSources,
    importJobs,
    bulkImportJobs,
    loading,
    importLoading,
    bulkImportLoading,
    activeBulkJobId,
    bulkProgress,
    loadData,
    handleImport,
    handleBulkImport,
    setActiveBulkJobId,
  } = useTrailImport();

  // Use our custom hooks
  const { isSettingUpDb, dbSetupError, checkAndSetupDatabase, retryDatabaseSetup } = useDBSetup(loadData);
  
  const { 
    bulkImportOpen, 
    setBulkImportOpen, 
    trailCount, 
    setTrailCount, 
    onBulkImport 
  } = useBulkImport(handleBulkImport);
  
  const { 
    selectedSources, 
    handleSourceSelect, 
    getSourceNameById,
    selectAllSources,
    deselectAllSources 
  } = useSourceSelection(dataSources);
  
  const { autoImportTriggered, triggerAutoImport } = useAutoImport({
    dataSources,
    loading,
    bulkImportLoading,
    activeBulkJobId,
    handleBulkImport,
    trailCount,
    setActiveTab
  });

  useEffect(() => {
    // Load data when component mounts, no user authentication check
    loadData();
  }, [loadData]);
  
  // Check if database tables exist and set them up if needed
  useEffect(() => {
    if (!loading && bulkImportJobs === undefined && !isSettingUpDb && !dbSetupError) {
      checkAndSetupDatabase();
    }
  }, [loading, bulkImportJobs, isSettingUpDb, dbSetupError, checkAndSetupDatabase]);

  // Function to handle the bulk import
  const handleBulkImportClick = async () => {
    const success = await onBulkImport(selectedSources, dataSources);
    if (success) {
      setActiveTab('bulk'); // Switch to bulk tab to show progress
    }
    return success;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOProvider 
        title="Trail Data Import - GreenTrails Admin"
        description="Import and manage trail data from various sources"
      />
      
      <Navbar />
      
      <div className="flex-grow bg-slate-50 dark:bg-greentrail-950 py-8">
        <div className="container mx-auto px-4">
          <DatabaseSetupAlerts 
            isSettingUpDb={isSettingUpDb}
            dbSetupError={dbSetupError !== null}
            retryDatabaseSetup={async () => await checkAndSetupDatabase()}
          />
        
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Trail Data Import</h1>
            <Button 
              onClick={triggerAutoImport} 
              disabled={bulkImportLoading || isSettingUpDb || loading || activeBulkJobId !== null}
              className="bg-greentrail-600 hover:bg-greentrail-700"
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Auto-Import Trails
            </Button>
          </div>
          
          <ImportHeader
            bulkImportOpen={bulkImportOpen}
            setBulkImportOpen={setBulkImportOpen}
            selectedSources={selectedSources}
            onSourceSelect={handleSourceSelect}
            trailCount={trailCount}
            onTrailCountChange={setTrailCount}
            onBulkImport={handleBulkImportClick}
            bulkImportLoading={bulkImportLoading || isSettingUpDb}
            dataSources={dataSources}
            loadData={loadData}
          />
          
          <BulkImportSection 
            bulkImportOpen={bulkImportOpen}
            setBulkImportOpen={setBulkImportOpen}
            selectedSources={selectedSources}
            dataSources={dataSources}
            onSourceSelect={handleSourceSelect}
            trailCount={trailCount}
            onTrailCountChange={setTrailCount}
            onBulkImport={handleBulkImportClick}
            bulkImportLoading={bulkImportLoading}
            activeBulkJobId={activeBulkJobId}
            bulkProgress={bulkProgress}
          />
          
          <ImportTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            dataSources={dataSources}
            importJobs={importJobs}
            bulkImportJobs={bulkImportJobs || []} 
            loading={loading || isSettingUpDb}
            importLoading={importLoading}
            handleImport={handleImport}
            getSourceNameById={getSourceNameById}
            selectAllSources={selectAllSources}
            deselectAllSources={deselectAllSources}
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminTrailImport;
