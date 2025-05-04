
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Toaster } from '@/components/ui/toaster';

// Core pages with no lazy loading
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';

// Lazily loaded page components
const Discover = lazy(() => import('@/pages/Discover'));
const Trail = lazy(() => import('@/pages/Trail'));
const Profile = lazy(() => import('@/pages/Profile'));
const Auth = lazy(() => import('@/pages/Auth'));
const Social = lazy(() => import('@/pages/Social'));
const AlbumDetail = lazy(() => import('@/pages/AlbumDetail'));
const CreateAlbum = lazy(() => import('@/pages/CreateAlbum'));
const Legal = lazy(() => import('@/pages/Legal'));
const AdminTrailImport = lazy(() => import('@/features/admin/trail-import/AdminTrailImport'));
const AdminImportGuidePage = lazy(() => import('@/pages/AdminImportGuidePage'));
const AdminRedirect = lazy(() => import('@/pages/AdminRedirect'));
const AutoImport = lazy(() => import('@/pages/AutoImport'));

// Components
import AssistantBubble from '@/components/assistant/AssistantBubble';
import LoadingFallback from '@/components/LoadingFallback';

import './App.css';

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/trails/:trailId" element={<Trail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/social" element={<Social />} />
              <Route path="/albums/:albumId" element={<AlbumDetail />} />
              <Route path="/create-album" element={<CreateAlbum />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/update-password" element={<Auth />} />
              <Route path="/legal/:policyType" element={<Legal />} />
              <Route path="/admin" element={<AdminRedirect />} />
              <Route path="/admin/trails/import" element={<AdminTrailImport />} />
              <Route path="/admin/trails/import/guide" element={<AdminImportGuidePage />} />
              <Route path="/auto-import" element={<AutoImport />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          
          {/* Assistant bubble available on all pages */}
          <AssistantBubble />
          
          {/* Toast notifications */}
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
