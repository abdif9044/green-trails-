
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/providers/theme-provider';
import { Layout } from '@/components/layout/layout';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/providers/auth-provider';
import { useAuth } from '@/hooks/use-auth';
import LoadingFallback from '@/components/LoadingFallback';

// Lazy loaded components
const Discover = lazy(() => import('@/pages/Discover'));
const Auth = lazy(() => import('@/pages/Auth'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const HomePage = lazy(() => import('@/pages/HomePage'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const AdminTrailImport = lazy(() => import('@/pages/AdminTrailImport'));
const AutoImportPage = lazy(() => import('@/pages/AutoImportPage'));
const AdminRedirect = lazy(() => import('@/pages/AdminRedirect'));

// Route Protection Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isInitialized } = useAuth();
  
  if (!isInitialized || loading) {
    return <LoadingFallback message="Checking authentication..." />;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/auth" element={<Auth />} />
      
      {/* Protected routes */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminRedirect />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/trails/import" element={
        <ProtectedRoute>
          <AdminTrailImport />
        </ProtectedRoute>
      } />
      
      <Route path="/auto-import" element={
        <ProtectedRoute>
          <AutoImportPage />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent route transitions during initial mount to avoid hydration issues
  if (!isMounted) {
    return <LoadingFallback message="Loading GreenTrails..." />;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <Layout>
          <Suspense fallback={<LoadingFallback />}>
            <AppRoutes />
          </Suspense>
          <Toaster />
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
