
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/providers/auth-provider';
import LoadingFallback from '@/components/LoadingFallback';

// Lazy load components for better performance
const HomePage = lazy(() => import('@/pages/HomePage'));
const Discover = lazy(() => import('@/pages/Discover'));
const Social = lazy(() => import('@/pages/Social'));
const Auth = lazy(() => import('@/pages/Auth'));
const Profile = lazy(() => import('@/pages/Profile'));
const AdminTrailImport = lazy(() => import('@/features/admin/trail-import/AdminTrailImport'));
const AutoImportPage = lazy(() => import('@/pages/AutoImportPage'));
const AutoImport = lazy(() => import('@/pages/AutoImport'));

const AppRoutes: React.FC = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/social" element={<Social />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin/import" element={<AdminTrailImport />} />
              <Route path="/auto-import" element={<AutoImportPage />} />
              <Route path="/auto-refresh" element={<AutoImport />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default AppRoutes;
