
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { EmergencyDashboard } from '@/components/admin/EmergencyDashboard';
import { DatabaseHealthCheck } from '@/components/database/DatabaseHealthCheck';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Admin: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - GreenTrails</title>
        <meta name="description" content="GreenTrails administrative dashboard" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              GreenTrails Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Emergency launch preparation and system management
            </p>
          </div>

          <Tabs defaultValue="emergency" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="emergency">🚨 Emergency Launch Prep</TabsTrigger>
              <TabsTrigger value="health">🔧 System Health</TabsTrigger>
            </TabsList>
            
            <TabsContent value="emergency" className="mt-6">
              <EmergencyDashboard />
            </TabsContent>
            
            <TabsContent value="health" className="mt-6">
              <DatabaseHealthCheck />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Admin;
