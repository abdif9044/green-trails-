
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from '@/providers/theme-provider'
import { AuthProvider } from '@/providers/auth-provider';
import { ErrorBoundary } from 'react-error-boundary'
import { Layout } from '@/components/layout/layout';
import { EasterEggsProvider } from '@/contexts/easter-eggs-context';
import LoadingFallback from '@/components/LoadingFallback';
import { Helmet } from 'react-helmet-async';
import AppRoutes from '@/components/routing/AppRoutes';
import { KonamiCodeHandler } from '@/components/easter-eggs/KonamiCodeHandler';

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

function App() {
  return (
    <ThemeProvider>
      <EasterEggsProvider>
        <AuthProvider>
          <BrowserRouter>
            <Helmet>
              <title>GreenTrails - Discover Nature's Path</title>
              <meta name="description" content="Discover and share hiking trails and outdoor adventures with the GreenTrails community. Find your path, connect with nature." />
            </Helmet>
            <div className="App">
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <React.Suspense fallback={<LoadingFallback />}>
                  <Layout>
                    <AppRoutes />
                  </Layout>
                  <KonamiCodeHandler />
                </React.Suspense>
              </ErrorBoundary>
            </div>
          </BrowserRouter>
          <Toaster />
        </AuthProvider>
      </EasterEggsProvider>
    </ThemeProvider>
  );
}

export default App;
