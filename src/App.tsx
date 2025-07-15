
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ToasterWrapper } from "@/components/ToasterWrapper";
import { UnifiedAuthProvider } from "@/hooks/auth/use-unified-auth";
import { ThemeProvider } from "@/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { navItems } from "./nav-items";
import ImportDebugPage from "./pages/admin/ImportDebug";
import { errorReporter } from "@/utils/error-reporting";

const App: React.FC = () => {
  React.useEffect(() => {
    // Initialize production monitoring
    errorReporter.trackEvent('app_start', {
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      environment: import.meta.env.MODE
    });
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="greentrails-theme">
        <TooltipProvider>
          <UnifiedAuthProvider>
            <BrowserRouter>
              <ToasterWrapper />
              <ErrorBoundary>
                <Routes>
                  {navItems.map(({ to, page: PageComponent }) => (
                    <Route key={to} path={to} element={<PageComponent />} />
                  ))}
                  <Route path="/admin/import-debug" element={<ImportDebugPage />} />
                </Routes>
              </ErrorBoundary>
            </BrowserRouter>
          </UnifiedAuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
