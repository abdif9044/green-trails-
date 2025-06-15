
import React from 'react';
import PWAInstallPrompt from '@/components/mobile/PWAInstallPrompt';
import Navbar from '@/components/Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-greentrail-50 via-white to-greentrail-50 dark:from-greentrail-950 dark:via-gray-900 dark:to-greentrail-950">
      {/* Enhanced glass background pattern */}
      <div className="fixed inset-0 geometric-pattern opacity-30" />
      <div className="fixed inset-0 luxury-pattern opacity-20" />
      
      {/* Main glass overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-white/5 via-transparent to-greentrail-500/5 backdrop-blur-[0.5px]" />
      
      <div className="relative z-10">
        <Navbar />
        
        {/* Content with top padding to account for fixed navbar */}
        <main className="pt-20">
          {children}
        </main>
        
        <PWAInstallPrompt />
      </div>
    </div>
  );
};
