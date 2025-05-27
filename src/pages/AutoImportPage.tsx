
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { APIKeySetup } from '@/components/api-setup/APIKeySetup';
import { ProductionDataImport } from '@/components/production/ProductionDataImport';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Database, Users } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';

const AutoImportPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<'setup' | 'import' | 'beta' | 'production'>('setup');
  const [trailCount, setTrailCount] = useState(0);
  const [apiKeysConfigured, setApiKeysConfigured] = useState(false);
  const [importComplete, setImportComplete] = useState(false);

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
    
    checkCurrentState();
  }, [user, navigate, toast]);

  const checkCurrentState = async () => {
    try {
      // Check trail count
      const { count } = await supabase
        .from('trails')
        .select('*', { count: 'exact', head: true });
      
      setTrailCount(count || 0);
      
      // Determine current phase based on trail count and setup
      if (count && count > 50000) {
        setCurrentPhase('production');
        setImportComplete(true);
      } else if (count && count > 10000) {
        setCurrentPhase('beta');
        setImportComplete(true);
      } else if (count && count > 1000) {
        setCurrentPhase('import');
      } else {
        setCurrentPhase('setup');
      }
      
    } catch (error) {
      console.error('Error checking current state:', error);
    }
  };

  const handleApiKeysConfigured = () => {
    setApiKeysConfigured(true);
    if (currentPhase === 'setup') {
      setCurrentPhase('import');
    }
  };

  const handleImportComplete = () => {
    setImportComplete(true);
    setCurrentPhase('beta');
    checkCurrentState(); // Refresh trail count
  };

  const getPhaseStatus = (phase: string) => {
    const phases = ['setup', 'import', 'beta', 'production'];
    const currentIndex = phases.indexOf(currentPhase);
    const phaseIndex = phases.indexOf(phase);
    
    if (phaseIndex < currentIndex) return 'complete';
    if (phaseIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Production Setup - GreenTrails</title>
      </Helmet>
      
      <Navbar />
      
      <div className="flex-grow bg-slate-50 dark:bg-greentrail-950 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Production Launch Setup</h1>
            <p className="text-muted-foreground">
              Configure your GreenTrails app for production with real trail data and user testing.
            </p>
          </div>

          {/* Phase Progress */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Launch Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  {getPhaseStatus('setup') === 'complete' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : getPhaseStatus('setup') === 'current' ? (
                    <Clock className="h-5 w-5 text-blue-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                  )}
                  <div>
                    <div className="font-medium">API Setup</div>
                    <Badge variant={getPhaseStatus('setup') === 'complete' ? 'default' : 'secondary'}>
                      {getPhaseStatus('setup') === 'complete' ? 'Complete' : 
                       getPhaseStatus('setup') === 'current' ? 'Current' : 'Pending'}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getPhaseStatus('import') === 'complete' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : getPhaseStatus('import') === 'current' ? (
                    <Database className="h-5 w-5 text-blue-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                  )}
                  <div>
                    <div className="font-medium">Data Import</div>
                    <Badge variant={getPhaseStatus('import') === 'complete' ? 'default' : 'secondary'}>
                      {getPhaseStatus('import') === 'complete' ? 'Complete' : 
                       getPhaseStatus('import') === 'current' ? 'Current' : 'Pending'}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getPhaseStatus('beta') === 'complete' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : getPhaseStatus('beta') === 'current' ? (
                    <Users className="h-5 w-5 text-blue-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                  )}
                  <div>
                    <div className="font-medium">Beta Testing</div>
                    <Badge variant={getPhaseStatus('beta') === 'complete' ? 'default' : 'secondary'}>
                      {getPhaseStatus('beta') === 'complete' ? 'Complete' : 
                       getPhaseStatus('beta') === 'current' ? 'Ready' : 'Pending'}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getPhaseStatus('production') === 'complete' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : getPhaseStatus('production') === 'current' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                  )}
                  <div>
                    <div className="font-medium">Production</div>
                    <Badge variant={getPhaseStatus('production') === 'complete' ? 'default' : 'secondary'}>
                      {getPhaseStatus('production') === 'complete' ? 'Live' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Trail Count */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-greentrail-600 mb-2">
                  {trailCount.toLocaleString()}
                </div>
                <div className="text-muted-foreground">
                  Trails currently in database
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Phase-specific content */}
          {currentPhase === 'setup' && (
            <APIKeySetup onKeysConfigured={handleApiKeysConfigured} />
          )}

          {(currentPhase === 'import' || (currentPhase === 'setup' && apiKeysConfigured)) && (
            <ProductionDataImport onImportComplete={handleImportComplete} />
          )}

          {currentPhase === 'beta' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Ready for Beta Testing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Congratulations! Your app now has {trailCount.toLocaleString()} trails and is ready for beta testing.
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Next steps:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Invite 10-50 beta users (friends, family, hiking enthusiasts)</li>
                    <li>• Test core features: discover trails, create albums, social features</li>
                    <li>• Gather feedback on user experience and performance</li>
                    <li>• Monitor app performance with real usage data</li>
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => navigate('/discover')}>
                    Explore Trail Database
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/social')}>
                    Test Social Features
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentPhase === 'production' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Production Ready
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Your GreenTrails app is production-ready with {trailCount.toLocaleString()} trails! 
                  The database is optimized and ready for public launch.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button onClick={() => navigate('/discover')} className="w-full">
                    Launch Discover Page
                  </Button>
                  <Button onClick={() => navigate('/social')} variant="outline" className="w-full">
                    Open Social Features
                  </Button>
                  <Button onClick={() => navigate('/admin/import')} variant="outline" className="w-full">
                    Manage Data Sources
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AutoImportPage;
