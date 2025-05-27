import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Discover from '@/pages/Discover';
import TrailDetailPage from '@/pages/TrailDetailPage';
import ProfilePage from '@/pages/ProfilePage';
import AuthPage from '@/pages/AuthPage';
import AdminTrailImport from '@/pages/AdminTrailImport';

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QueryClient>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/trail/:id" element={<TrailDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin/import" element={<AdminTrailImport />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </QueryClient>
    </Suspense>
  );
}

export default App;
