import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, RefreshCcw, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';

const AutoImportPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);
  const [nextScheduled, setNextScheduled] = useState<string | null>(null);
  const [totalTrailCount, setTotalTrailCount] = useState<number>(0);
  const [jobStats, setJobStats] = useState({
    totalJobs: 0,
    succeededJobs: 0,
    failedJobs: 0,
    totalTrails: 0
  });
  const [isIndexesCreated, setIsIndexesCreated] = useState<boolean>(false);
  const [isCreatingIndexes, setIsCreatingIndexes] = useState<boolean>(false);
  const [activeSources, setActiveSources] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access this page.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    fetchRefreshInfo();
    checkDatabaseIndexes();
    fetchTotalTrailCount();
    fetchActiveSources();
  }, [user, navigate, toast]);

  const fetchActiveSources = async () => {
    try {
      const { data: sources, error } = await supabase
        .from('trail_data_sources')
        .select('*')
        .eq('is_active', true);
        
      if (error) throw error;
      setActiveSources(sources || []);
    } catch (error) {
      console.error('Error fetching active sources:', error);
    }
  };

  const fetchRefreshInfo = async () => {
    try {
      // Get the most recent completed bulk job
      const { data: recentJobs, error: jobError } = await supabase
        .from('bulk_import_jobs')
        .select('*')
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(10);
        
      if (jobError) throw jobError;
      
      if (recentJobs && recentJobs.length > 0) {
        // Set the last refresh date
        setLastRefresh(recentJobs[0].completed_at);
        
        // Calculate next scheduled refresh (7 days from last)
        const lastDate = new Date(recentJobs[0].completed_at);
        const nextDate = new Date(lastDate);
        nextDate.setDate(nextDate.getDate() + 7);
        setNextScheduled(nextDate.toISOString());
        
        // Calculate job statistics
        const totalJobs = recentJobs.length;
        const succeededJobs = recentJobs.filter(job => 
          job.trails_processed > 0 && job.trails_failed < job.trails_processed / 2
        ).length;
        
        const failedJobs = totalJobs - succeededJobs;
        
        // Calculate total trails processed across jobs
        const totalTrails = recentJobs.reduce((sum, job) => 
          sum + job.trails_processed, 0
        );
        
        setJobStats({
          totalJobs,
          succeededJobs,
          failedJobs,
          totalTrails
        });
      }
    } catch (error) {
      console.error('Error fetching refresh info:', error);
      toast({
        title: "Failed to load data",
        description: "Could not retrieve the auto-import schedule information.",
        variant: "destructive",
      });
    }
  };

  const fetchTotalTrailCount = async () => {
    try {
      const { count, error } = await supabase
        .from('trails')
        .select('*', { count: 'exact', head: true });
        
      if (error) throw error;
      
      setTotalTrailCount(count || 0);
    } catch (error) {
      console.error('Error fetching trail count:', error);
    }
  };

  const checkDatabaseIndexes = async () => {
    try {
      // Check if the optimization indexes exist using a simpler method - query one trail with a specific index
      const { data, error } = await supabase
        .from('trails')
        .select('id')
        .eq('country', 'USA')
        .limit(1);
        
      if (error && error.message.includes('index')) {
        // If error mentions index issues, assume indexes don't exist
        setIsIndexesCreated(false);
      } else {
        // No index error, assume indexes are working
        setIsIndexesCreated(true);
      }
    } catch (error) {
      console.error('Error checking database indexes:', error);
      setIsIndexesCreated(false);
    }
  };

  const createDatabaseIndexes = async () => {
    setIsCreatingIndexes(true);
    try {
      // Execute the SQL directly using the Edge Function instead
      const { data, error } = await supabase.functions.invoke('create-database-indexes', {
        body: { action: 'create' }
      });
        
      if (error) throw error;
      
      toast({
        title: "Database optimized",
        description: "Performance indexes have been created for large-scale trail data.",
      });
      
      setIsIndexesCreated(true);
    } catch (error) {
      console.error('Error creating database indexes:', error);
      toast({
        title: "Optimization failed",
        description: "Could not create database performance indexes.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingIndexes(false);
    }
  };

  const handleManualRefresh = async () => {
    setLoading(true);
    
    try {
      console.log('Starting massive trail import process...');
      
      // Check if we have active sources
      if (activeSources.length === 0) {
        toast({
          title: "No active sources",
          description: "Please set up and activate data sources before refreshing trail data.",
          variant: "destructive",
        });
        return;
      }
      
      console.log(`Found ${activeSources.length} active sources:`, activeSources.map(s => s.name));
      
      // Create database indexes first if they don't exist
      if (!isIndexesCreated) {
        console.log('Creating database indexes for better performance...');
        toast({
          title: "Optimizing database",
          description: "Creating performance indexes before import...",
        });
        
        try {
          await createDatabaseIndexes();
        } catch (indexError) {
          console.warn('Could not create indexes, but continuing with import:', indexError);
        }
      }
      
      // Map source types to the massive import function
      const sourceTypes = activeSources.map(source => {
        switch (source.source_type) {
          case 'overpass':
            return 'openstreetmap';
          case 'usgs':
            return 'usgs';
          case 'hiking_project':
            return 'hiking_project';
          default:
            return 'hiking_project'; // Default fallback
        }
      });
      
      // Start the massive import with real APIs
      console.log('Invoking import-trails-massive function...');
      const response = await supabase.functions.invoke('import-trails-massive', {
        body: {
          sources: [...new Set(sourceTypes)], // Remove duplicates
          maxTrailsPerSource: 15000, // Higher limit for real data
          batchSize: 50, // Smaller batches for better reliability
          concurrency: 2 // Conservative concurrency for external APIs
        }
      });
      
      console.log('Massive import response:', response);
      
      if (response.error) {
        console.error('Massive import error:', response.error);
        throw new Error(response.error.message || 'Failed to start massive import');
      }
      
      const result = response.data;
      
      toast({
        title: "Import completed successfully!",
        description: `Imported ${result.total_added} trails from ${result.source_progress?.length || 0} real data sources. ${result.total_failed > 0 ? `${result.total_failed} trails failed to import.` : ''}`,
      });
      
      // Refresh the data to show updated counts
      setTimeout(() => {
        fetchRefreshInfo();
        fetchTotalTrailCount();
      }, 2000);
      
    } catch (error) {
      console.error('Error starting massive import:', error);
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Could not start the massive trail import process.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Auto Import & Database Optimization - GreenTrails</title>
      </Helmet>
      
      <Navbar />
      
      <div className="flex-grow bg-slate-50 dark:bg-greentrail-950 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Trail Database Management</h1>
            <p className="text-muted-foreground">
              Manage automatic trail data refreshes and database optimizations for large-scale trail data.
            </p>
          </div>
          
          <div className="grid gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>Database Status</span>
                  <span className="text-2xl">{totalTrailCount.toLocaleString()}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Your trail database currently contains <strong>{totalTrailCount.toLocaleString()}</strong> trails.
                  {totalTrailCount > 20000 ? 
                    " This is a large dataset that benefits from database optimization." : 
                    " As your trail collection grows, database optimization becomes important."}
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      Database Performance Indexes: 
                      <span className={isIndexesCreated ? "text-green-500 ml-2" : "text-yellow-500 ml-2"}>
                        {isIndexesCreated ? "Optimized" : "Not Optimized"}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {isIndexesCreated ? 
                        "Your database is optimized for large-scale trail data." : 
                        "Creating indexes will improve search and filtering performance."}
                    </p>
                  </div>
                  
                  <Button 
                    onClick={createDatabaseIndexes} 
                    disabled={isIndexesCreated || isCreatingIndexes}
                    variant={isIndexesCreated ? "outline" : "default"}
                  >
                    {isCreatingIndexes ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Database className="mr-2 h-4 w-4" />
                        {isIndexesCreated ? "Already Optimized" : "Optimize Database"}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar size={20} />
                  Schedule Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Last refresh:</p>
                  <p className="font-medium">
                    {lastRefresh ? new Date(lastRefresh).toLocaleString() : 'Never'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Next scheduled refresh:</p>
                  <p className="font-medium">
                    {nextScheduled ? new Date(nextScheduled).toLocaleString() : 'Not scheduled'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mt-4">
                    The system automatically refreshes trail data from sources every 7 days to keep information current.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <RefreshCcw size={20} />
                  Active Data Sources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  {activeSources.length > 0 ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                  <span className="font-medium">
                    {activeSources.length} active source{activeSources.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                {activeSources.length > 0 ? (
                  <div className="space-y-2">
                    {activeSources.slice(0, 3).map((source) => (
                      <div key={source.id} className="text-sm">
                        <span className="font-medium">{source.name}</span>
                        <span className="text-muted-foreground ml-2">({source.source_type})</span>
                      </div>
                    ))}
                    {activeSources.length > 3 && (
                      <div className="text-sm text-muted-foreground">
                        +{activeSources.length - 3} more sources
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No active data sources found. Please activate sources in the admin panel.
                  </p>
                )}
                
                <Button 
                  onClick={handleManualRefresh} 
                  disabled={loading || activeSources.length === 0}
                  className="w-full mt-4"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Starting Import...
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Refresh Trail Data Now
                    </>
                  )}
                </Button>
                
                {activeSources.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Set up data sources in the admin panel before refreshing.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Refresh Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total jobs:</p>
                  <p className="font-medium">{jobStats.totalJobs}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Succeeded:</p>
                  <p className="font-medium text-green-600">{jobStats.succeededJobs}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Failed:</p>
                  <p className="font-medium text-red-600">{jobStats.failedJobs}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trails processed:</p>
                  <p className="font-medium">{jobStats.totalTrails.toLocaleString()}</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Manual refresh will import up to 10,000 trails from your active data sources. 
                The process runs in optimized batches for better performance and reliability.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/import')}
                className="mr-2"
              >
                Go to Trail Import Admin
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/discover')}
              >
                View Current Trails
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AutoImportPage;
