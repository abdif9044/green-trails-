
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Index from './pages/Index';
import { AuthPage } from './pages/AuthPage';
import { ResetPasswordForm } from './components/auth/ResetPasswordForm';
import { AuthGuard } from './components/auth/AuthGuard';
import { UserProfile } from './components/UserProfile';

// Optimized lazy loading with better error handling
const LazyTrail = React.lazy(() => import('./pages/TrailDetailPage'));
const LazyDiscover = React.lazy(() => import('./pages/Discover'));
const LazySocial = React.lazy(() => import('./pages/Social'));
const LazyProfile = React.lazy(() => import('./pages/Profile'));
const LazyAdminTrailImport = React.lazy(() => import('./features/admin/trail-import/AdminTrailImport'));
const LazyAlbumDetail = React.lazy(() => import('./pages/AlbumDetail'));
const LazyCreateAlbum = React.lazy(() => import('./pages/CreateAlbum'));
const LazyBadges = React.lazy(() => import('./pages/Badges'));
const LazyAutoImportPage = React.lazy(() => import('./pages/AutoImportPage'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-greentrail-600" />
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordForm />} />
      
      {/* Protected Routes */}
      <Route path="/profile" element={
        <AuthGuard>
          <UserProfile />
        </AuthGuard>
      } />
      
      <Route path="/discover" element={
        <AuthGuard>
          <Suspense fallback={<LoadingFallback />}>
            <LazyDiscover />
          </Suspense>
        </AuthGuard>
      } />
      
      <Route path="/social" element={
        <AuthGuard>
          <Suspense fallback={<LoadingFallback />}>
            <LazySocial />
          </Suspense>
        </AuthGuard>
      } />
      
      <Route path="/trail/:id" element={
        <AuthGuard>
          <Suspense fallback={<LoadingFallback />}>
            <LazyTrail />
          </Suspense>
        </AuthGuard>
      } />
      
      <Route path="/admin/import" element={
        <AuthGuard>
          <Suspense fallback={<LoadingFallback />}>
            <LazyAdminTrailImport />
          </Suspense>
        </AuthGuard>
      } />
      
      <Route path="/album/:id" element={
        <AuthGuard>
          <Suspense fallback={<LoadingFallback />}>
            <LazyAlbumDetail />
          </Suspense>
        </AuthGuard>
      } />
      
      <Route path="/create-album" element={
        <AuthGuard>
          <Suspense fallback={<LoadingFallback />}>
            <LazyCreateAlbum />
          </Suspense>
        </AuthGuard>
      } />
      
      <Route path="/badges" element={
        <AuthGuard>
          <Suspense fallback={<LoadingFallback />}>
            <LazyBadges />
          </Suspense>
        </AuthGuard>
      } />
      
      <Route path="/auto-import" element={
        <AuthGuard>
          <Suspense fallback={<LoadingFallback />}>
            <LazyAutoImportPage />
          </Suspense>
        </AuthGuard>
      } />
    </Routes>
  );
};

export default AppRoutes;
