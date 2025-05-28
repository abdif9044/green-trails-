
import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import AppRoutes from '@/routes';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AuthErrorBoundary } from '@/components/auth/AuthErrorBoundary';
import LoadingFallback from '@/components/LoadingFallback';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <AppRoutes />
            <Toaster />
          </Suspense>
        </AuthErrorBoundary>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
