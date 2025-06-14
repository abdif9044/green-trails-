import * as React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from '@/providers/theme-provider'
import { AuthProvider } from '@/providers/auth-provider';
import { ErrorBoundary } from 'react-error-boundary'
import { Layout } from '@/components/layout/layout';
import MapContainer from '@/components/map/MapContainer';
import { LazyAdminTrailImport, LazyAlbumDetail, LazyAutoImportPage, LazyBadges, LazyCreateAlbum, LazyDiscover, LazyProfile, LazySocial, LazyTrail } from '@/components/lazy/LazyComponents';
import { EasterEggsProvider } from '@/contexts/easter-eggs-context';
import { useKonamiCode } from '@/hooks/use-konami-code';
import { useEasterEggs } from '@/contexts/easter-eggs-context';

// Move lazy imports to the top BEFORE usage
const AuthPage = React.lazy(() => import('@/pages/AuthPage'));
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));

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
  // Defensive: Use React.useRef to avoid running code before context is ready
  const [konamiReady, setKonamiReady] = React.useState(false);
  let triggerKonamiEasterEgg: undefined | (() => void);

  // Try/catch so code still works if context isn't ready due to loading in provider
  try {
    // Will throw error only if not rendered in correct hierarchy
    // Don't destructure in outer scope, so context can be missing during hydration
    triggerKonamiEasterEgg = require('@/contexts/easter-eggs-context').useEasterEggs().triggerKonamiEasterEgg;
  } catch (e) {
    triggerKonamiEasterEgg = undefined;
  }

  // Run effect only if available
  React.useEffect(() => {
    if (triggerKonamiEasterEgg) {
      setKonamiReady(true);
    }
  }, [triggerKonamiEasterEgg]);

  React.useEffect(() => {
    if (!konamiReady) return;
    // Dynamically import/useKonamiCode to avoid SSR/hydration mismatch
    const { useKonamiCode } = require('@/hooks/use-konami-code');
    useKonamiCode(triggerKonamiEasterEgg!);
  }, [konamiReady, triggerKonamiEasterEgg]);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout><React.Suspense fallback={<>Loading...</>}><HomePage /></React.Suspense></Layout>} />
          <Route path="/discover" element={<Layout><React.Suspense fallback={<>Loading...</>}><LazyDiscover /></React.Suspense></Layout>} />
          <Route path="/social" element={<Layout><React.Suspense fallback={<>Loading...</>}><LazySocial /></React.Suspense></Layout>} />
          <Route path="/profile" element={<Layout><React.Suspense fallback={<>Loading...</>}><LazyProfile /></React.Suspense></Layout>} />
          <Route path="/badges" element={<Layout><React.Suspense fallback={<>Loading...</>}><LazyBadges /></React.Suspense></Layout>} />
          <Route path="/trail/:trailId" element={<Layout><React.Suspense fallback={<>Loading...</>}><LazyTrail /></React.Suspense></Layout>} />
          <Route path="/album/:albumId" element={<Layout><React.Suspense fallback={<>Loading...</>}><LazyAlbumDetail /></React.Suspense></Layout>} />
          <Route path="/create-album" element={<Layout><React.Suspense fallback={<>Loading...</>}><LazyCreateAlbum /></React.Suspense></Layout>} />
          <Route path="/map-test" element={<Layout><MapContainer /></Layout>} />
          <Route path="/admin/trail-import" element={<Layout><React.Suspense fallback={<>Loading...</>}><LazyAdminTrailImport /></React.Suspense></Layout>} />
          <Route path="/auto-import" element={<Layout><React.Suspense fallback={<>Loading...</>}><LazyAutoImportPage /></React.Suspense></Layout>} />
          <Route path="/auth" element={<Layout><React.Suspense fallback={<>Loading...</>}><AuthPage /></React.Suspense></Layout>} />
          <Route path="*" element={<Layout><React.Suspense fallback={<>Loading...</>}><NotFoundPage /></React.Suspense></Layout>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

// Providers (QueryClientProvider, HelmetProvider, etc.) remain in main.tsx!
function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider>
        <EasterEggsProvider>
          <AuthProvider>
            <AppContent />
            <Toaster />
          </AuthProvider>
        </EasterEggsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
