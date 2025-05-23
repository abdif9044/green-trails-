import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/use-auth';
import HomePage from './pages/HomePage';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import Legal from './pages/Legal';
import AdminRedirect from './pages/AdminRedirect';
import AdminImportGuidePage from './pages/AdminImportGuidePage';
import { Loader2 } from 'lucide-react';

// Import lazy components
import {
  LazyTrail,
  LazyDiscover,
  LazySocial,
  LazyProfile,
  LazyAdminTrailImport,
  LazyAlbumDetail,
  LazyCreateAlbum,
  LazyBadges,
  LazyAutoImportPage,
} from './components/lazy/LazyComponents';

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-greentrail-950 dark:to-greentrail-900">
    <div className="flex items-center space-x-2">
      <Loader2 className="h-8 w-8 animate-spin text-greentrail-600" />
      <span className="text-lg font-medium text-greentrail-700 dark:text-greentrail-300">Loading...</span>
    </div>
  </div>
);

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* Main app routes with lazy loading */}
        <Route path="/trails/:id" element={<LazyTrail />} />
        <Route path="/discover" element={<LazyDiscover />} />
        <Route path="/social" element={<LazySocial />} />
        
        {/* Profile routes */}
        <Route path="/profile" element={<LazyProfile />} />
        <Route path="/profile/:id" element={<LazyProfile />} />
        
        {/* Admin routes - no auth requirement for easier access */}
        <Route path="/admin/import" element={<LazyAdminTrailImport />} />
        <Route path="/admin/auto-import" element={<LazyAutoImportPage />} />
        <Route path="/admin/import-guide" element={<AdminImportGuidePage />} />
        <Route path="/admin" element={<AdminRedirect />} />
        
        {/* Quick route for auto-import */}
        <Route path="/auto-import" element={<LazyAdminTrailImport />} />
        
        {/* Album routes */}
        <Route path="/album/:id" element={<LazyAlbumDetail />} />
        <Route path="/album/create" element={<LazyCreateAlbum />} />
        
        {/* Other routes */}
        <Route path="/badges" element={<LazyBadges />} />
        <Route path="/legal/:id" element={<Legal />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
