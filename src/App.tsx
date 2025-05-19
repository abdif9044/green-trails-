
import React, { useState, useEffect } from 'react';
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
import { ToastProvider } from './components/ToastProvider';
import SplashScreen from './components/SplashScreen';
import Badges from './pages/Badges';
import AutoImport from './pages/AutoImport';
import './App.css';

function App() {
  const { user } = useAuth();
  const [splashFinished, setSplashFinished] = useState(false);

  if (!splashFinished) {
    return <SplashScreen onFinished={() => setSplashFinished(true)} />;
  }

  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/trail/:id" element={<Trail />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/social" element={<Social />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/legal/:type" element={<Legal />} />
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
    </ToastProvider>
  );
}

export default App;
