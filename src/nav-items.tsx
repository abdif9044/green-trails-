
import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import HomePage from '@/pages/HomePage';
import ImportDebugPage from '@/pages/admin/ImportDebug';
import AuthPage from '@/pages/AuthPage';
import TrailsPage from '@/pages/TrailsPage';
import SearchPage from '@/pages/SearchPage';
import ProfilePage from '@/pages/ProfilePage';

// Wrap each page component with error boundary
const withErrorBoundary = (Component: React.ComponentType) => {
  return () => (
    <ErrorBoundary>
      <Component />
    </ErrorBoundary>
  );
};

export const navItems = [
  {
    title: "Home",
    to: "/",
    page: withErrorBoundary(HomePage),
  },
  {
    title: "Trails",
    to: "/trails",
    page: withErrorBoundary(TrailsPage),
  },
  {
    title: "Search",
    to: "/search", 
    page: withErrorBoundary(SearchPage),
  },
  {
    title: "Profile",
    to: "/profile",
    page: withErrorBoundary(ProfilePage),
  },
  {
    title: "Auth",
    to: "/auth",
    page: withErrorBoundary(AuthPage),
  },
  {
    title: "Reset Password",
    to: "/auth/reset-password",
    page: withErrorBoundary(() => {
      const ResetPasswordPage = React.lazy(() => import('@/pages/ResetPasswordPage'));
      return (
        <React.Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordPage />
        </React.Suspense>
      );
    }),
  },
  {
    title: "Admin Debug",
    to: "/admin/import-debug",
    page: withErrorBoundary(ImportDebugPage),
  },
];
