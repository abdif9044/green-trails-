
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { EnhancedAuthProvider } from "@/providers/enhanced-auth-provider";
import Index from "./pages/Index";
import Discover from "./pages/Discover";
import Social from "./pages/Social";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Trail from "./pages/Trail";
import AdminTrailImport from "./pages/AdminTrailImport";
import AutoImport from "./pages/AutoImport";
import AutoImportPage from "./pages/AutoImportPage";
import TrailRecovery from "./pages/TrailRecovery";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <EnhancedAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/social" element={<Social />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/trail/:id" element={<Trail />} />
              <Route path="/admin/import" element={<AdminTrailImport />} />
              <Route path="/admin/auto-import" element={<AutoImportPage />} />
              <Route path="/auto-import" element={<AutoImport />} />
              <Route path="/recovery" element={<TrailRecovery />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </EnhancedAuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
