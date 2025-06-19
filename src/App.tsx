
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from "@/providers/theme-provider";
import { EnhancedAuthProvider } from "@/providers/enhanced-auth-provider";
import { SafeProvider } from "@/providers/SafeProvider";
import AppRoutes from "@/components/routing/AppRoutes";

const App = () => (
  <SafeProvider name="App Root" fallback={<div className="p-4 text-center">Loading app...</div>}>
    <HelmetProvider>
      <SafeProvider name="Theme Provider">
        <ThemeProvider defaultTheme="system" storageKey="greentrails-theme">
          <SafeProvider name="Auth Provider">
            <EnhancedAuthProvider>
              <SafeProvider name="Tooltip Provider">
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <AppRoutes />
                </TooltipProvider>
              </SafeProvider>
            </EnhancedAuthProvider>
          </SafeProvider>
        </ThemeProvider>
      </SafeProvider>
    </HelmetProvider>
  </SafeProvider>
);

export default App;
