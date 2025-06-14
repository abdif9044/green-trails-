import React, { Suspense } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from './contexts/AuthContext';
import { QueryProvider } from './contexts/QueryContext';
import { ErrorBoundary } from 'react-error-boundary'
import ErrorDisplay from '@/components/ErrorDisplay';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Layout } from '@/components/layout/layout';
import MapContainer from '@/components/map/MapContainer';
import MapLoadingState from '@/components/map/MapLoadingState';
import { LazyAdminTrailImport, LazyAlbumDetail, LazyAutoImportPage, LazyBadges, LazyCreateAlbum, LazyDiscover, LazyProfile, LazySocial, LazyTrail } from '@/components/lazy/LazyComponents';
import { EasterEggsProvider } from '@/contexts/easter-eggs-context';
import { useKonamiCode } from '@/hooks/use-konami-code';
import { useEasterEggs } from '@/contexts/easter-eggs-context';

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
    <ErrorBoundary FallbackComponent={ErrorDisplay}>
      <ThemeProvider defaultTheme="light" storageKey="greentrails-ui-theme">
        <EasterEggsProvider>
          <AuthProvider>
            <QueryProvider>
              <AppContent />
              <Toaster />
            </QueryProvider>
          </AuthProvider>
        </EasterEggsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

const AuthPage = React.lazy(() => import('@/pages/AuthPage'));
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));
