
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from "@/providers/theme-provider";
import { EnhancedAuthProvider } from "@/providers/enhanced-auth-provider";
import AppRoutes from "@/components/routing/AppRoutes";

const App = () => (
  <HelmetProvider>
    <ThemeProvider defaultTheme="system" storageKey="greentrails-theme">
      <EnhancedAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </EnhancedAuthProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
