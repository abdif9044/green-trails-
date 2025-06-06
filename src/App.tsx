
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/providers/auth-provider";
import { UserProvider } from "@/contexts/user-context";
import { ThemeProvider } from "@/providers/theme-provider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Trail from "./pages/Trail";
import Discover from "./pages/Discover";
import Social from "./pages/Social";
import CreateAlbum from "./pages/CreateAlbum";
import AlbumDetail from "./pages/AlbumDetail";
import Profile from "./pages/Profile";
import Legal from "./pages/Legal";
import Settings from "./pages/Settings";
import Badges from "./pages/Badges";
import AdminTrailImport from "./pages/AdminTrailImport";
import AutoImport from "./pages/AutoImport";
import NotFound from "./pages/NotFound";
import { AuthGuard } from "./components/auth/AuthGuard";
import { Layout } from "./components/layout/layout";
import AssistantBubble from "./components/assistant/AssistantBubble";
import "./App.css";

const queryClient = new QueryClient();

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
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/trail/:id" element={<Trail />} />
                  <Route path="/discover" element={<Discover />} />
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
                  <Route path="/album/:id" element={<AlbumDetail />} />
                  <Route path="/profile/:username?" element={<Profile />} />
                  <Route path="/legal/:type" element={<Legal />} />
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
                  <Route path="/admin/import" element={
                    <AuthGuard>
                      <AdminTrailImport />
                    </AuthGuard>
                  } />
                  <Route path="/admin/auto-import" element={
                    <AuthGuard>
                      <AutoImport />
                    </AuthGuard>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
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
