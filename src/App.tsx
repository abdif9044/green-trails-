
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import ToastProvider from '@/components/ToastProvider';
import ErrorBoundary from '@/components/ErrorBoundary';

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
import AdminTrailImport from '@/pages/AdminTrailImport';
import AdminImportGuidePage from '@/pages/AdminImportGuidePage';
import AdminRedirect from '@/pages/AdminRedirect';

// Components
import AssistantBubble from '@/components/assistant/AssistantBubble';

import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Helmet>
          <title>GreenTrails - Find Your Path</title>
          <meta name="description" content="Discover the best hiking trails, share your adventures, and connect with nature enthusiasts." />
        </Helmet>
        
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ToastProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/discover" element={<Discover />} />
                  <Route path="/trails/:trailId" element={<Trail />} />
                  <Route path="/profile/:userId" element={<Profile />} />
                  <Route path="/social" element={<Social />} />
                  <Route path="/albums/:albumId" element={<AlbumDetail />} />
                  <Route path="/create-album" element={<CreateAlbum />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/legal/:policyType" element={<Legal />} />
                  <Route path="/admin" element={<AdminRedirect />} />
                  <Route path="/admin/trails/import" element={<AdminTrailImport />} />
                  <Route path="/admin/trails/import/guide" element={<AdminImportGuidePage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                
                {/* Assistant bubble available on all pages */}
                <AssistantBubble />
              </BrowserRouter>
            </ToastProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
