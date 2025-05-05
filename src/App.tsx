
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/providers/theme-provider';
import { Layout } from '@/components/layout/layout';
import { Toaster } from '@/components/ui/toaster';
import Discover from '@/pages/Discover';
import Auth from '@/pages/Auth';
import ProfilePage from '@/pages/ProfilePage';
import HomePage from '@/pages/HomePage';
import NotFound from '@/pages/NotFound';
import AdminTrailImport from '@/pages/AdminTrailImport';
import AutoImportPage from '@/pages/AutoImportPage';
import AdminRedirect from '@/pages/AdminRedirect';

function App() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent route transitions during initial mount to avoid hydration issues
  if (!isMounted) {
    return null;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminRedirect />} />
          <Route path="/admin/trails/import" element={<AdminTrailImport />} />
          <Route path="/auto-import" element={<AutoImportPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
