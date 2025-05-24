import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Index from './pages/Index';
import { AuthPage } from './pages/AuthPage';
import { ResetPasswordForm } from './components/auth/ResetPasswordForm';
import { AuthGuard } from './components/auth/AuthGuard';
import { UserProfile } from './components/UserProfile';
import { LazyTrail } from './components/lazy/LazyComponents';
import { LazyDiscover } from './components/lazy/LazyComponents';
import { LazySocial } from './components/lazy/LazyComponents';
import { LazyProfile } from './components/lazy/LazyComponents';
import { LazyAdminTrailImport } from './components/lazy/LazyComponents';
import { LazyAlbumDetail } from './components/lazy/LazyComponents';
import { LazyCreateAlbum } from './components/lazy/LazyComponents';
import { LazyBadges } from './components/lazy/LazyComponents';
import { LazyAutoImportPage } from './components/lazy/LazyComponents';
import { LazyAdminTrailImportFeature } from './components/lazy/LazyComponents';

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-greentrail-600" />
  </div>
);

const AppRoutes = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
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
              <LazyDiscover />
            </AuthGuard>
          } />
          
          <Route path="/social" element={
            <AuthGuard>
              <LazySocial />
            </AuthGuard>
          } />
          
          <Route path="/trail/:id" element={
            <AuthGuard>
              <LazyTrail />
            </AuthGuard>
          } />
          
          <Route path="/admin/import" element={
            <AuthGuard>
              <LazyAdminTrailImport />
            </AuthGuard>
          } />
          
          <Route path="/album/:id" element={
            <AuthGuard>
              <LazyAlbumDetail />
            </AuthGuard>
          } />
          
          <Route path="/create-album" element={
            <AuthGuard>
              <LazyCreateAlbum />
            </AuthGuard>
          } />
          
          <Route path="/badges" element={
            <AuthGuard>
              <LazyBadges />
            </AuthGuard>
          } />
          
          <Route path="/auto-import" element={
            <AuthGuard>
              <LazyAutoImportPage />
            </AuthGuard>
          } />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
