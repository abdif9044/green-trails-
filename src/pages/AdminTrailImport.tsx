
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowDownUp,
  Check,
  Clock,
  Download,
  Filter,
  Loader2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import SEOProvider from "@/components/SEOProvider";

type TrailDataSource = {
  id: string;
  name: string;
  source_type: string;
  url: string | null;
  country: string | null;
  state_province: string | null;
  last_synced: string | null;
  next_sync: string | null;
  is_active: boolean;
  config: any;
};

type ImportJob = {
  id: string;
  source_id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  trails_processed: number;
  trails_added: number;
  trails_updated: number;
  trails_failed: number;
  error_message: string | null;
};

const AdminTrailImport = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [dataSources, setDataSources] = useState<TrailDataSource[]>([]);
  const [importJobs, setImportJobs] = useState<ImportJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [importLoading, setImportLoading] = useState<Record<string, boolean>>({});

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
    
    // Load trail data sources and import jobs
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch data sources
        const { data: sources, error: sourcesError } = await supabase
          .from("trail_data_sources")
          .select("*")
          .order("last_synced", { ascending: false });
          
        if (sourcesError) throw sourcesError;
        
        // Fetch recent import jobs
        const { data: jobs, error: jobsError } = await supabase
          .from("trail_import_jobs")
          .select("*")
          .order("started_at", { ascending: false })
          .limit(20);
          
        if (jobsError) throw jobsError;
        
        setDataSources(sources || []);
        setImportJobs(jobs || []);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error loading data",
          description: "Failed to load trail import data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user, navigate, toast]);
  
  const handleImport = async (sourceId: string) => {
    if (importLoading[sourceId]) return;
    
    setImportLoading(prev => ({ ...prev, [sourceId]: true }));
    try {
      // Call the import-trails edge function
      const response = await supabase.functions.invoke('import-trails', {
        body: { sourceId }
      });
      
      if (response.error) throw new Error(response.error.message);
      
      toast({
        title: "Import started",
        description: "The trail import process has been started successfully.",
      });
      
      // Refresh the import jobs list
      const { data: jobs } = await supabase
        .from("trail_import_jobs")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(20);
        
      if (jobs) {
        setImportJobs(jobs);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import error",
        description: "Failed to start the trail import process.",
        variant: "destructive",
      });
    } finally {
      setImportLoading(prev => ({ ...prev, [sourceId]: false }));
    }
  };
  
  const getSourceNameById = (sourceId: string): string => {
    const source = dataSources.find(src => src.id === sourceId);
    return source ? source.name : 'Unknown Source';
  };
  
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Never';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'Invalid date';
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
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-greentrail-800 dark:text-greentrail-200">
                Trail Data Import
              </h1>
              <p className="text-greentrail-600 dark:text-greentrail-400">
                Import and manage trail data from various sources
              </p>
            </div>
          </div>
          
          <Tabs defaultValue="sources" className="mt-6">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="sources">Data Sources</TabsTrigger>
              <TabsTrigger value="jobs">Import Jobs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sources" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Trail Data Sources</CardTitle>
                  <CardDescription>
                    Manage and import data from various trail data providers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin text-greentrail-600" />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Region</TableHead>
                            <TableHead>Last Synced</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dataSources.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-6">
                                No data sources found
                              </TableCell>
                            </TableRow>
                          ) : (
                            dataSources.map((source) => (
                              <TableRow key={source.id}>
                                <TableCell className="font-medium">{source.name}</TableCell>
                                <TableCell>{source.source_type}</TableCell>
                                <TableCell>
                                  {source.country}
                                  {source.state_province && `, ${source.state_province}`}
                                </TableCell>
                                <TableCell>{formatDate(source.last_synced)}</TableCell>
                                <TableCell>
                                  {source.is_active ? (
                                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                      Active
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                                      Inactive
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    onClick={() => handleImport(source.id)}
                                    disabled={importLoading[source.id] || !source.is_active}
                                    size="sm"
                                    className="gap-1"
                                  >
                                    {importLoading[source.id] ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Download className="h-4 w-4" />
                                    )}
                                    {importLoading[source.id] ? 'Importing...' : 'Import'}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="jobs" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Import Jobs</CardTitle>
                  <CardDescription>
                    View the status and results of recent trail import jobs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin text-greentrail-600" />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Source</TableHead>
                            <TableHead>Started</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Added</TableHead>
                            <TableHead className="text-right">Updated</TableHead>
                            <TableHead className="text-right">Failed</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {importJobs.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-6">
                                No import jobs found
                              </TableCell>
                            </TableRow>
                          ) : (
                            importJobs.map((job) => (
                              <TableRow key={job.id}>
                                <TableCell className="font-medium">
                                  {getSourceNameById(job.source_id)}
                                </TableCell>
                                <TableCell>{formatDate(job.started_at)}</TableCell>
                                <TableCell>
                                  {job.status === 'completed' ? (
                                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 gap-1">
                                      <Check className="w-3 h-3" />
                                      Completed
                                    </Badge>
                                  ) : job.status === 'processing' ? (
                                    <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 gap-1">
                                      <Clock className="w-3 h-3" />
                                      Processing
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 gap-1">
                                      <X className="w-3 h-3" />
                                      Error
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">{job.trails_added}</TableCell>
                                <TableCell className="text-right">{job.trails_updated}</TableCell>
                                <TableCell className="text-right">{job.trails_failed}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminTrailImport;
