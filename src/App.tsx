
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Toaster } from '@/components/ui/toaster';

// Pages
import Index from '@/pages/Index';
import Discover from '@/pages/Discover';
import Trail from '@/pages/Trail';
import Profile from '@/pages/Profile';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import Social from '@/pages/Social';
import AlbumDetail from '@/pages/AlbumDetail';
import CreateAlbum from '@/pages/CreateAlbum';
import Legal from '@/pages/Legal';
import AdminTrailImport from '@/features/admin/trail-import/AdminTrailImport';
import AdminImportGuidePage from '@/pages/AdminImportGuidePage';
import AdminRedirect from '@/pages/AdminRedirect';

// Components
import AssistantBubble from '@/components/assistant/AssistantBubble';

import './App.css';

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <BrowserRouter>
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
            <Route path="*" element={<NotFound />} />
          </Routes>
          
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
