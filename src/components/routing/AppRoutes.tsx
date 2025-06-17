
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingFallback from '@/components/LoadingFallback';

// Lazy load components for better performance
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const Discover = React.lazy(() => import('@/pages/Discover'));
const Social = React.lazy(() => import('@/pages/Social'));
const Auth = React.lazy(() => import('@/pages/Auth'));
const Profile = React.lazy(() => import('@/pages/Profile'));
const Settings = React.lazy(() => import('@/pages/Settings'));
const Trail = React.lazy(() => import('@/pages/Trail'));
const Badges = React.lazy(() => import('@/pages/Badges'));
const AdminTrailImport = React.lazy(() => import('@/pages/AdminTrailImport'));
const AmericasImportDashboard = React.lazy(() => import('@/components/trails/AmericasImportDashboard'));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/trail/:id" element={<Trail />} />
        <Route path="/social" element={<Social />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/badges" element={<Badges />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/signin" element={<Auth />} />
        <Route path="/admin" element={<AdminTrailImport />} />
        <Route path="/admin-trail-import" element={<AdminTrailImport />} />
        <Route path="/americas-import" element={<AmericasImportDashboard />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
