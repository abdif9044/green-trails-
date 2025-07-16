
import React from 'react';
import PWAInstallPrompt from '@/components/mobile/PWAInstallPrompt';
import MobileBottomNav from '@/components/mobile/MobileBottomNav';
import MobileHeader from '@/components/mobile/MobileHeader';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <MobileHeader />
      <main className="pb-16 md:pb-0">
        {children}
      </main>
      <MobileBottomNav />
      <PWAInstallPrompt />
    </>
  );
};
