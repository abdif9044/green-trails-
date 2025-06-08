
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import SettingsHeader from '@/components/settings/SettingsHeader';
import AccountSettings from '@/components/settings/AccountSettings';
import AppSettings from '@/components/settings/AppSettings';
import { User, Settings as SettingsIcon } from 'lucide-react';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-4">
            <p>Please sign in to access settings.</p>
            <Button onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-slate-50 dark:bg-greentrail-950 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <SettingsHeader />
          
          <Tabs defaultValue="app" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="app" className="flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" />
                App Settings
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Account
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="app">
              <AppSettings />
            </TabsContent>
            
            <TabsContent value="account">
              <AccountSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
