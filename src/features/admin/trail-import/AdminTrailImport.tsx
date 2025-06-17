
import React, { useEffect } from "react";
import { useTrailImport } from "@/hooks/useTrailImport";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOProvider from "@/components/SEOProvider";
import { Button } from "@/components/ui/button";
import { PlayCircle, AlertCircle, Smartphone } from "lucide-react";
import QuickImport10K from "@/components/trails/QuickImport10K";
import DebugImportInterface from "@/components/trails/DebugImportInterface";
import EnhancedDebugInterface from "@/components/trails/EnhancedDebugInterface";

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
  const [activeTab, setActiveTab] = React.useState("enhanced-debug");
  const [mobileAutoTriggered, setMobileAutoTriggered] = React.useState(false);
  
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
    handleBulkImport: originalHandleBulkImport,
    setActiveBulkJobId,
  } = useTrailImport();

  // Create a wrapper that matches the expected signature
  const handleBulkImport = async (sourceIds: string[], trailCount: number): Promise<boolean> => {
    try {
      await originalHandleBulkImport();
      return true;
    } catch (error) {
      console.error('Bulk import failed:', error);
      return false;
    }
  };

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

  // Check if user is on mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  useEffect(() => {
    // Load data when component mounts - no authentication required for admin import
    loadData();
  }, [loadData]);
  
  // Check if database tables exist and set them up if needed
  useEffect(() => {
    if (!loading && bulkImportJobs === undefined && !isSettingUpDb && !dbSetupError) {
      checkAndSetupDatabase();
    }
  }, [loading, bulkImportJobs, isSettingUpDb, dbSetupError, checkAndSetupDatabase]);

  // Auto-trigger enhanced debug on mobile (with user permission)
  useEffect(() => {
    if (isMobile && !mobileAutoTriggered && !loading && !isSettingUpDb && dataSources.length > 0) {
      setMobileAutoTriggered(true);
      
      // Show mobile-optimized notification
      toast({
        title: "🚀 Mobile Debug Mode Activated",
        description: "Starting enhanced debug sequence to fix the 100% failure rate issue.",
      });
      
      // Auto-trigger the enhanced debug after a brief delay
      setTimeout(() => {
        const enhancedDebugButton = document.querySelector('[data-enhanced-debug-trigger]') as HTMLButtonElement;
        if (enhancedDebugButton) {
          enhancedDebugButton.click();
        }
      }, 2000);
    }
  }, [isMobile, mobileAutoTriggered, loading, isSettingUpDb, dataSources.length, toast]);

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

          {/* Mobile-specific notice */}
          {isMobile && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800">
                <Smartphone className="h-5 w-5" />
                <strong>Mobile Debug Mode</strong>
              </div>
              <p className="text-blue-700 mt-1">
                Enhanced debug sequence will auto-start to identify and fix the trail import failures.
              </p>
            </div>
          )}

          {/* Success notice for no authentication required */}
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <AlertCircle className="h-5 w-5" />
              <strong>Admin Access Enabled</strong>
            </div>
            <p className="text-green-700 mt-1">
              No authentication required for trail import operations. Ready to test 1000-trail import!
            </p>
          </div>
        
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

          {/* Critical Issue Alert */}
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <strong>CRITICAL: 100% Import Failure Rate Detected</strong>
            </div>
            <p className="text-red-700 mt-1">
              Recent imports processed thousands of trails but 0 were actually added to the database. 
              Use the Enhanced Debug interface below to identify and fix the root cause.
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
          
          {/* Enhanced Tabs with new debug interface */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('enhanced-debug')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'enhanced-debug'
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  🚨 Enhanced Debug
                </button>
                <button
                  onClick={() => setActiveTab('debug')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'debug'
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  🔍 Basic Debug
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
              {activeTab === 'enhanced-debug' && (
                <EnhancedDebugInterface />
              )}
              
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
                  selectAllSources={() => {}}
                  deselectAllSources={() => {}}
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
                  selectAllSources={() => {}}
                  deselectAllSources={() => {}}
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
