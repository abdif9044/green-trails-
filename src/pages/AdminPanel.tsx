
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOProvider from '@/components/SEOProvider';
import { ImportDashboard } from '@/features/trail-import/ImportDashboard';
import { AutonomousImportTrigger } from '@/components/autonomous/AutonomousImportTrigger';
import { DatabaseHealthCheck } from '@/components/database/DatabaseHealthCheck';
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
              Phase 1 Complete: Database foundation fixed with RLS policies and performance indexes
            </p>
          </div>

          {/* System Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Database className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Database</p>
                  <p className="font-semibold">Phase 1 ✅</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">RLS Policies</p>
                  <p className="font-semibold">Fixed</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Zap className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Indexes</p>
                  <p className="font-semibold">Optimized</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Edge Functions</p>
                  <p className="font-semibold">Updated</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Database Health Check */}
          <div className="mb-8">
            <DatabaseHealthCheck />
          </div>

          {/* Autonomous Import Trigger */}
          <div className="mb-8">
            <AutonomousImportTrigger />
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
