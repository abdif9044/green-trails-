
import React, { Suspense } from 'react';
import { Toaster } from 'sonner';
import AppRoutes from '@/routes';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AuthErrorBoundary } from '@/components/auth/AuthErrorBoundary';
import LoadingFallback from '@/components/LoadingFallback';
import { AuthProvider } from '@/providers/auth-provider';

function App() {
  return (
    <ErrorBoundary>
      <AuthErrorBoundary>
        <AuthProvider>
          <Suspense fallback={<LoadingFallback />}>
            <AppRoutes />
            <Toaster />
          </Suspense>
        </AuthProvider>
      </AuthErrorBoundary>
    </ErrorBoundary>
  );
}

export default App;
