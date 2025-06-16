
import React from 'react';
import { Routes, Route } from "react-router-dom";
import { LazyAdminTrailImport, LazyAlbumDetail, LazyAutoImportPage, LazyBadges, LazyCreateAlbum, LazyDiscover, LazyProfile, LazySocial, LazyTrail } from '@/components/lazy/LazyComponents';
import MapContainer from '@/components/map/MapContainer';

const AuthPage = React.lazy(() => import('@/pages/AuthPage'));
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/discover" element={<LazyDiscover />} />
      <Route path="/social" element={<LazySocial />} />
      <Route path="/profile" element={<LazyProfile />} />
      <Route path="/badges" element={<LazyBadges />} />
      <Route path="/trail/:trailId" element={<LazyTrail />} />
      <Route path="/album/:albumId" element={<LazyAlbumDetail />} />
      <Route path="/create-album" element={<LazyCreateAlbum />} />
      <Route path="/map-test" element={<MapContainer />} />
      <Route path="/admin/trail-import" element={<LazyAdminTrailImport />} />
      <Route path="/auto-import" element={<LazyAutoImportPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
