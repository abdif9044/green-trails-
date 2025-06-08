
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "@/providers/auth-provider";
import { UserProvider } from "@/contexts/user-context";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthGuard } from "./components/auth/AuthGuard";
import { Layout } from "./components/layout/layout";
import AssistantBubble from "./components/assistant/AssistantBubble";
import LoadingFallback from "./components/LoadingFallback";
import "./App.css";

// Lazy load all pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Trail = lazy(() => import("./pages/Trail"));
const Discover = lazy(() => import("./pages/Discover"));
const Social = lazy(() => import("./pages/Social"));
const CreateAlbum = lazy(() => import("./pages/CreateAlbum"));
const AlbumDetail = lazy(() => import("./pages/AlbumDetail"));
const Profile = lazy(() => import("./pages/Profile"));
const Legal = lazy(() => import("./pages/Legal"));
const Settings = lazy(() => import("./pages/Settings"));
const Badges = lazy(() => import("./pages/Badges"));
const AdminTrailImport = lazy(() => import("./pages/AdminTrailImport"));
const AutoImport = lazy(() => import("./pages/AutoImport"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <UserProvider>
              <Layout>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/trail/:id" element={<Trail />} />
                    <Route path="/discover" element={<Discover />} />
                    <Route path="/legal/:type" element={<Legal />} />
                    <Route path="/album/:id" element={<AlbumDetail />} />
                    <Route path="/profile/:username?" element={<Profile />} />

                    {/* Protected Routes */}
                    <Route path="/social" element={
                      <AuthGuard>
                        <Social />
                      </AuthGuard>
                    } />
                    <Route path="/create-album" element={
                      <AuthGuard>
                        <CreateAlbum />
                      </AuthGuard>
                    } />
                    <Route path="/settings" element={
                      <AuthGuard>
                        <Settings />
                      </AuthGuard>
                    } />
                    <Route path="/badges" element={
                      <AuthGuard>
                        <Badges />
                      </AuthGuard>
                    } />

                    {/* Admin Routes */}
                    <Route path="/admin/import" element={<Navigate to="/admin-trail-import" replace />} />
                    <Route path="/admin-trail-import" element={
                      <AuthGuard>
                        <AdminTrailImport />
                      </AuthGuard>
                    } />
                    <Route path="/admin/auto-import" element={
                      <AuthGuard>
                        <AutoImport />
                      </AuthGuard>
                    } />

                    {/* Legacy redirects */}
                    <Route path="/auto-import" element={<Navigate to="/admin/auto-import" replace />} />
                    <Route path="/auto-refresh" element={<Navigate to="/admin/auto-import" replace />} />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                <AssistantBubble />
              </Layout>
            </UserProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
