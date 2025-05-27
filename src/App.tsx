
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Discover from '@/pages/Discover';
import Trail from '@/pages/Trail';
import ProfilePage from '@/pages/ProfilePage';
import { AuthPage } from '@/pages/AuthPage';
import AdminTrailImport from '@/pages/AdminTrailImport';

const queryClient = new QueryClient();

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/trail/:id" element={<Trail />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin/import" element={<AdminTrailImport />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </QueryClientProvider>
    </Suspense>
  );
}

export default App;
