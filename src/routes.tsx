
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/providers/auth-provider';
import LoadingFallback from '@/components/LoadingFallback';

// Lazy load components for better performance
const HomePage = lazy(() => import('@/pages/HomePage'));
const Discover = lazy(() => import('@/pages/Discover'));
const Social = lazy(() => import('@/pages/Social'));
const Auth = lazy(() => import('@/pages/Auth'));
const Profile = lazy(() => import('@/pages/Profile'));
const Settings = lazy(() => import('@/pages/Settings'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const AdminTrailImport = lazy(() => import('@/features/admin/trail-import/AdminTrailImport'));
const AutoImportPage = lazy(() => import('@/pages/AutoImportPage'));
const AutoImport = lazy(() => import('@/pages/AutoImport'));

const AppRoutes: React.FC = () => {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/social" element={<Social />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/admin/import" element={<AdminTrailImport />} />
          <Route path="/auto-import" element={<AutoImportPage />} />
          <Route path="/auto-refresh" element={<AutoImport />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
};

export default AppRoutes;
