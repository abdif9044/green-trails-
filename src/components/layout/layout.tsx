
import React from 'react';
import { Outlet } from 'react-router-dom';
import PWAInstallPrompt from '@/components/mobile/PWAInstallPrompt';
import MobileBottomNav from '@/components/mobile/MobileBottomNav';
import MobileHeader from '@/components/mobile/MobileHeader';
import Footer from '@/components/Footer';

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <MobileHeader />
      <main className="pb-16 md:pb-0">
        {children ?? <Outlet />}
      </main>
      <Footer />
      <MobileBottomNav />
      <PWAInstallPrompt />
    </>
  );
};
