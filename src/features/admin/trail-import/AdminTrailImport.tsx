
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useTrailImport } from "@/hooks/useTrailImport";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOProvider from "@/components/SEOProvider";

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
  const navigate = useNavigate();
  const { user } = useAuth();
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
  
  const { autoImportTriggered } = useAutoImport({
    dataSources,
    loading,
    bulkImportLoading,
    activeBulkJobId,
    handleBulkImport,
    trailCount,
    setActiveTab
  });

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access this page.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    loadData();
  }, [user, navigate, toast, loadData]);
  
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
            dbSetupError={dbSetupError}
            retryDatabaseSetup={retryDatabaseSetup}
          />
        
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
