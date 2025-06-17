
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingFallback from '@/components/LoadingFallback';

// Lazy load components for better performance
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const DiscoverPage = React.lazy(() => import('@/pages/Discover'));
const TrailPage = React.lazy(() => import('@/pages/Trail'));
const SocialPage = React.lazy(() => import('@/pages/Social'));
const ProfilePage = React.lazy(() => import('@/pages/Profile'));
const SettingsPage = React.lazy(() => import('@/pages/Settings'));
const AuthPage = React.lazy(() => import('@/pages/Auth'));
const AdminTrailImport = React.lazy(() => import('@/pages/AdminTrailImport'));
const AmericasImportDashboard = React.lazy(() => import('@/components/trails/AmericasImportDashboard'));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/trail/:id" element={<TrailPage />} />
        <Route path="/social" element={<SocialPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/signin" element={<AuthPage />} />
        <Route path="/admin" element={<AdminTrailImport />} />
        <Route path="/americas-import" element={<AmericasImportDashboard />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
