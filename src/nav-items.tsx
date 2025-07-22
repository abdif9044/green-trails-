
import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import HomeContent from '@/components/home/HomeContent';
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
    page: withErrorBoundary(HomeContent),
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
    title: "Forgot Password",
    to: "/auth/forgot-password",
    page: withErrorBoundary(() => {
      const ForgotPasswordPage = React.lazy(() => import('@/pages/ForgotPasswordPage'));
      return (
        <React.Suspense fallback={<div>Loading...</div>}>
          <ForgotPasswordPage />
        </React.Suspense>
      );
    }),
  },
  {
    title: "Update Password",
    to: "/auth/update-password",
    page: withErrorBoundary(() => {
      const UpdatePasswordPage = React.lazy(() => import('@/pages/UpdatePasswordPage'));
      return (
        <React.Suspense fallback={<div>Loading...</div>}>
          <UpdatePasswordPage />
        </React.Suspense>
      );
    }),
  },
  {
    title: "Reset Password",
    to: "/auth/reset-password",
    page: withErrorBoundary(() => {
      const ForgotPasswordPage = React.lazy(() => import('@/pages/ForgotPasswordPage'));
      return (
        <React.Suspense fallback={<div>Loading...</div>}>
          <ForgotPasswordPage />
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
