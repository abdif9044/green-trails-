import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/use-auth';
import HomePage from './pages/HomePage';
import Auth from './pages/Auth';
import Trail from './pages/Trail';
import Discover from './pages/Discover';
import Social from './pages/Social';
import Profile from './pages/Profile';
import AdminTrailImport from './pages/AdminTrailImport';
import NotFound from './pages/NotFound';
import Legal from './pages/Legal';
import AlbumDetail from './pages/AlbumDetail';
import CreateAlbum from './pages/CreateAlbum';
import AdminRedirect from './pages/AdminRedirect';
import AdminImportGuidePage from './pages/AdminImportGuidePage';
import Badges from './pages/Badges';
import AutoImport from './pages/AutoImport';

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/trails/:id" element={<Trail />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/social" element={<Social />} />
      
      {/* Profile routes - keep authentication requirement */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/:id" element={<Profile />} />
      
      {/* Admin routes - no longer require authentication */}
      <Route path="/admin/import" element={<AdminTrailImport />} />
      <Route path="/admin/auto-import" element={<AutoImport />} />
      <Route path="/admin/import-guide" element={<AdminImportGuidePage />} />
      <Route path="/admin" element={<AdminRedirect />} />
      
      <Route path="/legal/:id" element={<Legal />} />
      <Route path="/album/:id" element={<AlbumDetail />} />
      <Route path="/album/create" element={<CreateAlbum />} />
      <Route path="/badges" element={<Badges />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
