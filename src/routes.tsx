
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
import PrivacyPolicy from './pages/PrivacyPolicy';

const AppRoutes: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/trail/:id" element={<Trail />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/social" element={<Social />} />
      <Route path="/profile/:userId" element={<Profile />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/legal/:type" element={<Legal />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/album/:albumId" element={<AlbumDetail />} />
      <Route path="/album/create" element={<CreateAlbum />} />
      <Route path="/badges" element={<Badges />} />
      {user && (
        <>
          <Route path="/admin/import" element={<AdminTrailImport />} />
          <Route path="/admin" element={<AdminRedirect />} />
          <Route path="/admin/guide" element={<AdminImportGuidePage />} />
          <Route path="/admin/auto-import" element={<AutoImport />} />
        </>
      )}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
