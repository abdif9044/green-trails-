
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/use-auth";
import { useTrailImport } from "@/hooks/useTrailImport";
import { useToast } from "@/hooks/use-toast";
import SEOProvider from "@/components/SEOProvider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownUp, Database } from "lucide-react";

// Import the admin components
import DataSourcesTab from "@/components/admin/DataSourcesTab";
import ImportJobsTab from "@/components/admin/ImportJobsTab";
import BulkImportJobsTab from "@/components/admin/BulkImportJobsTab";
import BulkImportDialog from "@/components/admin/BulkImportDialog";
import BulkImportProgressCard from "@/components/admin/BulkImportProgressCard";

const AdminTrailImport = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState("sources");
  const [bulkImportOpen, setBulkImportOpen] = React.useState(false);
  const [selectedSources, setSelectedSources] = React.useState<string[]>([]);
  const [trailCount, setTrailCount] = React.useState(1000);
  
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
    const success = await handleBulkImport(selectedSources, trailCount);
    if (success) {
      setBulkImportOpen(false);
    }
  };

  const handleSourceSelect = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId) 
        : [...prev, sourceId]
    );
  };

  const getSourceNameById = (sourceId: string): string => {
    const source = dataSources.find(src => src.id === sourceId);
    return source ? source.name : 'Unknown Source';
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
                onSourceSelect={handleSourceSelect}
                trailCount={trailCount}
                onTrailCountChange={setTrailCount}
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
          
          {activeBulkJobId && (
            <BulkImportProgressCard 
              progress={bulkProgress} 
            />
          )}
          
          <Tabs defaultValue="sources" className="mt-6" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="sources">Data Sources</TabsTrigger>
              <TabsTrigger value="jobs">Import Jobs</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Jobs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sources" className="mt-4">
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
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminTrailImport;
