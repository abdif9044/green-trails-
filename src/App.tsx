
import * as React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from '@/providers/theme-provider'
import { AuthProvider } from '@/providers/auth-provider';
import { ErrorBoundary } from 'react-error-boundary'
import { Layout } from '@/components/layout/layout';
import MapContainer from '@/components/map/MapContainer';
import { LazyAdminTrailImport, LazyAlbumDetail, LazyAutoImportPage, LazyBadges, LazyCreateAlbum, LazyDiscover, LazyProfile, LazySocial, LazyTrail } from '@/components/lazy/LazyComponents';
import { EasterEggsProvider } from '@/contexts/easter-eggs-context';
import LoadingFallback from '@/components/LoadingFallback';
import { Helmet } from 'react-helmet-async';

const AuthPage = React.lazy(() => import('@/pages/AuthPage'));
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));

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
  // Defensive: Use React.useRef to avoid running code before context is ready
  const [konamiReady, setKonamiReady] = React.useState(false);
  let triggerKonamiEasterEgg: undefined | (() => void);

  try {
    triggerKonamiEasterEgg = require('@/contexts/easter-eggs-context').useEasterEggs().triggerKonamiEasterEgg;
  } catch (e) {
    triggerKonamiEasterEgg = undefined;
  }

  React.useEffect(() => {
    if (triggerKonamiEasterEgg) {
      setKonamiReady(true);
    }
  }, [triggerKonamiEasterEgg]);

  React.useEffect(() => {
    if (!konamiReady) return;
    const { useKonamiCode } = require('@/hooks/use-konami-code');
    useKonamiCode(triggerKonamiEasterEgg!);
  }, [konamiReady, triggerKonamiEasterEgg]);

  return (
    <BrowserRouter>
      <Helmet>
        <title>GreenTrails - Discover Nature's Path</title>
        <meta name="description" content="Discover and share hiking trails and outdoor adventures with the GreenTrails community. Find your path, connect with nature." />
      </Helmet>
      <div className="App">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <React.Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/discover" element={<Layout><LazyDiscover /></Layout>} />
              <Route path="/social" element={<Layout><LazySocial /></Layout>} />
              <Route path="/profile" element={<Layout><LazyProfile /></Layout>} />
              <Route path="/badges" element={<Layout><LazyBadges /></Layout>} />
              <Route path="/trail/:trailId" element={<Layout><LazyTrail /></Layout>} />
              <Route path="/album/:albumId" element={<Layout><LazyAlbumDetail /></Layout>} />
              <Route path="/create-album" element={<Layout><LazyCreateAlbum /></Layout>} />
              <Route path="/map-test" element={<Layout><MapContainer /></Layout>} />
              <Route path="/admin/trail-import" element={<Layout><LazyAdminTrailImport /></Layout>} />
              <Route path="/auto-import" element={<Layout><LazyAutoImportPage /></Layout>} />
              <Route path="/auth" element={<Layout><AuthPage /></Layout>} />
              <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
            </Routes>
          </React.Suspense>
        </ErrorBoundary>
      </div>
    </BrowserRouter>
  );
}

// Only use App.tsx for routing and main providers, NOT src/routes.tsx
function App() {
  return (
    <ThemeProvider>
      <EasterEggsProvider>
        <AuthProvider>
          <AppContent />
          <Toaster />
        </AuthProvider>
      </EasterEggsProvider>
    </ThemeProvider>
  );
}

export default App;
