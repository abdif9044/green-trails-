
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOProvider from '@/components/SEOProvider';
import { ImportDashboard } from '@/features/trail-import/ImportDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Zap, Shield, TrendingUp } from 'lucide-react';

const AdminPanel: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <SEOProvider 
        title="Trail Import Admin - GreenTrails"
        description="Administrative dashboard for trail data import and management"
      />
      
      <Navbar />
      
      <div className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-2">
              Trail Import Administration
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Bulletproof trail import system with real-time monitoring and emergency recovery
            </p>
          </div>

          {/* System Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Database className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">System Status</p>
                  <p className="font-semibold">Operational</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Data Validation</p>
                  <p className="font-semibold">Bulletproof</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Zap className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Import Engine</p>
                  <p className="font-semibold">V2.0</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="font-semibold">100%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Import Dashboard */}
          <ImportDashboard />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminPanel;
