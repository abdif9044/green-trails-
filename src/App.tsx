
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/providers/theme-provider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ToasterWrapper } from "@/components/ToasterWrapper";
import { navItems } from "./nav-items";
import ImportDebugPage from "./pages/admin/ImportDebug";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="greentrails-theme">
        <TooltipProvider>
          <ToasterWrapper />
          <BrowserRouter>
            <ErrorBoundary>
              <Routes>
                {navItems.map(({ to, page: PageComponent }) => (
                  <Route key={to} path={to} element={<PageComponent />} />
                ))}
                <Route path="/admin/import-debug" element={<ImportDebugPage />} />
              </Routes>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
