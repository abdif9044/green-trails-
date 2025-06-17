
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoadingFallback } from '@/components/LoadingFallback';

// Lazy load components for better performance
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const DiscoverPage = React.lazy(() => import('@/pages/DiscoverPage'));
const TrailPage = React.lazy(() => import('@/pages/TrailPage'));
const SocialPage = React.lazy(() => import('@/pages/SocialPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage'));
const SignInPage = React.lazy(() => import('@/pages/SignInPage'));
const AdminPage = React.lazy(() => import('@/pages/AdminPage'));
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
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/americas-import" element={<AmericasImportDashboard />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
