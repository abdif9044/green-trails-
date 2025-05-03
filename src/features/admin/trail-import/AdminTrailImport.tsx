
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useTrailImport } from "@/hooks/useTrailImport";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOProvider from "@/components/SEOProvider";
import BulkImportProgressCard from "@/components/admin/BulkImportProgressCard";
import { Button } from "@/components/ui/button";
import { useAutoImport } from "./hooks/useAutoImport";
import { useSourceSelection } from "./hooks/useSourceSelection";
import ImportHeader from "./components/ImportHeader";
import ImportTabs from "./components/ImportTabs";

const AdminTrailImport = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("bulk");
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [trailCount, setTrailCount] = useState(55369); // Default to 55369 as requested
  
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

  const onBulkImport = async () => {
    // If no sources are selected, select all active sources
    const sourcesToUse = selectedSources.length > 0 
      ? selectedSources 
      : dataSources.filter(s => s.is_active).map(s => s.id);
    
    // Make sure we have sources
    if (sourcesToUse.length === 0) {
      toast({
        title: "No sources selected",
        description: "Please select at least one data source.",
        variant: "destructive"
      });
      return;
    }
    
    const success = await handleBulkImport(sourcesToUse, trailCount);
    if (success) {
      setBulkImportOpen(false);
      setActiveTab('bulk'); // Switch to bulk tab to show progress
    }
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
          <ImportHeader
            bulkImportOpen={bulkImportOpen}
            setBulkImportOpen={setBulkImportOpen}
            selectedSources={selectedSources}
            onSourceSelect={handleSourceSelect}
            trailCount={trailCount}
            onTrailCountChange={setTrailCount}
            onBulkImport={onBulkImport}
            bulkImportLoading={bulkImportLoading}
            dataSources={dataSources}
            loadData={loadData}
          />
          
          {activeBulkJobId && (
            <BulkImportProgressCard 
              progress={bulkProgress} 
            />
          )}
          
          <ImportTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            dataSources={dataSources}
            importJobs={importJobs}
            bulkImportJobs={bulkImportJobs}
            loading={loading}
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
