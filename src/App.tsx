
import React, { Suspense } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/providers/theme-provider'
import { AuthProvider } from '@/providers/auth-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary'
import { Layout } from '@/components/layout/layout';
import MapContainer from '@/components/map/MapContainer';
import { LazyAdminTrailImport, LazyAlbumDetail, LazyAutoImportPage, LazyBadges, LazyCreateAlbum, LazyDiscover, LazyProfile, LazySocial, LazyTrail } from '@/components/lazy/LazyComponents';
import { EasterEggsProvider } from '@/contexts/easter-eggs-context';
import { useKonamiCode } from '@/hooks/use-konami-code';
import { useEasterEggs } from '@/contexts/easter-eggs-context';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Simple error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-red-50">
    <div className="text-center p-8">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button 
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  </div>
);

function AppContent() {
  const { triggerKonamiEasterEgg } = useEasterEggs();
  
  // Konami code listener
  useKonamiCode(triggerKonamiEasterEgg);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout><Suspense fallback={<>Loading...</>}><HomePage /></Suspense></Layout>} />
          <Route path="/discover" element={<Layout><Suspense fallback={<>Loading...</>}><LazyDiscover /></Suspense></Layout>} />
          <Route path="/social" element={<Layout><Suspense fallback={<>Loading...</>}><LazySocial /></Suspense></Layout>} />
          <Route path="/profile" element={<Layout><Suspense fallback={<>Loading...</>}><LazyProfile /></Suspense></Layout>} />
          <Route path="/badges" element={<Layout><Suspense fallback={<>Loading...</>}><LazyBadges /></Suspense></Layout>} />
          <Route path="/trail/:trailId" element={<Layout><Suspense fallback={<>Loading...</>}><LazyTrail /></Suspense></Layout>} />
          <Route path="/album/:albumId" element={<Layout><Suspense fallback={<>Loading...</>}><LazyAlbumDetail /></Suspense></Layout>} />
          <Route path="/create-album" element={<Layout><Suspense fallback={<>Loading...</>}><LazyCreateAlbum /></Suspense></Layout>} />
          <Route path="/map-test" element={<Layout><MapContainer /></Layout>} />
          <Route path="/admin/trail-import" element={<Layout><Suspense fallback={<>Loading...</>}><LazyAdminTrailImport /></Suspense></Layout>} />
          <Route path="/auto-import" element={<Layout><Suspense fallback={<>Loading...</>}><LazyAutoImportPage /></Suspense></Layout>} />
          <Route path="/auth" element={<Layout><AuthPage /></Layout>} />
          <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="greentrails-ui-theme">
          <EasterEggsProvider>
            <AuthProvider>
              <AppContent />
              <Toaster />
            </AuthProvider>
          </EasterEggsProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

const AuthPage = React.lazy(() => import('@/pages/AuthPage'));
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));
