
import React from 'react';
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from '@/providers/theme-provider'
import { AuthProvider } from '@/providers/auth-provider';
import { Layout } from '@/components/layout/layout';
import { EasterEggsProvider } from '@/contexts/easter-eggs-context';
import LoadingFallback from '@/components/LoadingFallback';
import { Helmet } from 'react-helmet-async';
import AppRoutes from '@/components/routing/AppRoutes';
import { KonamiCodeHandler } from '@/components/easter-eggs/KonamiCodeHandler';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { AuthErrorBoundary } from '@/components/auth/AuthErrorBoundary';
import { SafeContextProvider } from '@/providers/SafeContextProvider';

function App() {
  return (
    <AppErrorBoundary>
      <SafeContextProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Helmet>
              <title>GreenTrails - Discover Nature's Path</title>
              <meta name="description" content="Discover and share hiking trails and outdoor adventures with the GreenTrails community. Find your path, connect with nature." />
            </Helmet>
            <div className="App">
              <React.Suspense fallback={<LoadingFallback />}>
                <EasterEggsProvider>
                  <AuthErrorBoundary>
                    <AuthProvider>
                      <Layout>
                        <AppRoutes />
                      </Layout>
                      <KonamiCodeHandler />
                    </AuthProvider>
                  </AuthErrorBoundary>
                </EasterEggsProvider>
              </React.Suspense>
            </div>
            <Toaster />
          </BrowserRouter>
        </ThemeProvider>
      </SafeContextProvider>
    </AppErrorBoundary>
  );
}

export default App;
