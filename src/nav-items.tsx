
import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import HomePage from '@/pages/HomePage';
import ImportDebugPage from '@/pages/admin/ImportDebug';

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
    page: withErrorBoundary(() => (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Trail Discovery</h1>
        <p className="text-gray-600">Trail discovery feature coming soon!</p>
      </div>
    )),
  },
  {
    title: "Search",
    to: "/search", 
    page: withErrorBoundary(() => (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Search Trails</h1>
        <p className="text-gray-600">Advanced trail search coming soon!</p>
      </div>
    )),
  },
  {
    title: "Profile",
    to: "/profile",
    page: withErrorBoundary(() => (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>
        <p className="text-gray-600">User profile management coming soon!</p>
      </div>
    )),
  },
  {
    title: "Admin Debug",
    to: "/admin/import-debug",
    page: withErrorBoundary(ImportDebugPage),
  },
];
