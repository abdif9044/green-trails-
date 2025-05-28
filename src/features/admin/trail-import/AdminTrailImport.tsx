import React, { useEffect } from "react";
import { useTrailImport } from "@/hooks/useTrailImport";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOProvider from "@/components/SEOProvider";
import { Button } from "@/components/ui/button";
import { PlayCircle, AlertCircle } from "lucide-react";
import QuickImport10K from "@/components/trails/QuickImport10K";
import DebugImportInterface from "@/components/trails/DebugImportInterface";

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
  const [activeTab, setActiveTab] = React.useState("debug"); // Changed default to debug
  
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
            <div className="flex gap-2">
              <Button 
                onClick={triggerAutoImport} 
                disabled={bulkImportLoading || isSettingUpDb || loading || activeBulkJobId !== null}
                className="bg-greentrail-600 hover:bg-greentrail-700"
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Auto-Import Trails
              </Button>
            </div>
          </div>

          {/* Debug Notice */}
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <strong>Import Pipeline Debug Mode</strong>
            </div>
            <p className="text-red-700 mt-1">
              Recent imports show 0% success rate. Use the debug interface below to identify and fix pipeline issues.
            </p>
          </div>

          {/* Quick 10K Import Section */}
          <div className="mb-6">
            <QuickImport10K />
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
          
          {/* Update ImportTabs to include debug tab */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('debug')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'debug'
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  🔍 Debug Pipeline
                </button>
                <button
                  onClick={() => setActiveTab('bulk')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'bulk'
                      ? 'border-greentrail-500 text-greentrail-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Bulk Import Jobs
                </button>
                <button
                  onClick={() => setActiveTab('individual')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'individual'
                      ? 'border-greentrail-500 text-greentrail-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Individual Imports
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              {activeTab === 'debug' && (
                <DebugImportInterface />
              )}
              
              {activeTab === 'bulk' && (
                <ImportTabs
                  activeTab="bulk"
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
              )}
              
              {activeTab === 'individual' && (
                <ImportTabs
                  activeTab="individual"
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
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminTrailImport;
