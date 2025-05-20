
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, RefreshCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AutoImport: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);
  const [nextScheduled, setNextScheduled] = useState<string | null>(null);
  const [jobStats, setJobStats] = useState({
    totalJobs: 0,
    succeededJobs: 0,
    failedJobs: 0,
    totalTrails: 0
  });

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
  }, [user, navigate, toast]);

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

  const handleManualRefresh = async () => {
    setLoading(true);
    
    try {
      // Get active data sources
      const { data: sources, error: sourcesError } = await supabase
        .from('trail_data_sources')
        .select('id')
        .eq('is_active', true)
        .limit(5);
        
      if (sourcesError) throw sourcesError;
      
      if (!sources || sources.length === 0) {
        toast({
          title: "No active sources",
          description: "Please set up data sources before refreshing trail data.",
          variant: "destructive",
        });
        return;
      }
      
      // Start the bulk import
      const response = await supabase.functions.invoke('bulk-import-trails-optimized', {
        body: {
          sourceIds: sources.map(s => s.id),
          totalTrails: 10000,
          batchSize: 2500,
          concurrency: 5
        }
      });
      
      if (response.error) throw new Error(response.error.message);
      
      toast({
        title: "Refresh started",
        description: "Trail data refresh has been initiated. This may take several minutes.",
      });
      
      // Navigate to the import page to see progress
      navigate('/admin/import');
    } catch (error) {
      console.error('Error starting refresh:', error);
      toast({
        title: "Refresh failed",
        description: "Could not start the trail data refresh process.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-slate-50 dark:bg-greentrail-950 py-8">
        <div className="container mx-auto px-4">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Trail Data Auto-Refresh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
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
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <RefreshCcw size={20} />
                      Refresh Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
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
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Automatic Refresh Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>The system is configured to automatically refresh trail data every 7 days. This ensures that your trail database stays up-to-date with the latest information from data sources.</p>
                  <p className="mt-2 text-sm text-muted-foreground">During each refresh, the system will:</p>
                  <ul className="list-disc ml-5 mt-1 text-sm text-muted-foreground">
                    <li>Check for sources that need updating</li>
                    <li>Process up to 5 sources per scheduled refresh</li>
                    <li>Update existing trail information</li>
                    <li>Add new trails that have been added to the data sources</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleManualRefresh} 
                    disabled={loading}
                    className="w-full md:w-auto"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Refreshing...
                      </>
                    ) : (
                      <>
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Refresh Now
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AutoImport;
