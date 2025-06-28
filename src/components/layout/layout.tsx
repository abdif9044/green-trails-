
import React from 'react';
import PWAInstallPrompt from '@/components/mobile/PWAInstallPrompt';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      {children}
      <PWAInstallPrompt />
    </>
  );
};
