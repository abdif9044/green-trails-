
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Social from "./pages/Social";
import NotFound from "./pages/NotFound";
import Trail from "./pages/Trail";
import CreateAlbum from "./pages/CreateAlbum";
import AlbumDetail from "./pages/AlbumDetail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <AuthProvider>
        <TooltipProvider>
          <ErrorBoundary>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/trail/:trailId" element={<Trail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/social" element={<Social />} />
              <Route path="/albums/new" element={<CreateAlbum />} />
              <Route path="/albums/:albumId" element={<AlbumDetail />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </TooltipProvider>
      </AuthProvider>
    </Router>
  </QueryClientProvider>
);

export default App;
