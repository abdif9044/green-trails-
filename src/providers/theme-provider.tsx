
import * as React from "react"

const ThemeContext = React.createContext<{
  theme: string;
  setTheme: (theme: string) => void;
  resolvedTheme: string;
} | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  const [theme, setTheme] = React.useState('light');

  React.useEffect(() => {
    console.log('ThemeProvider: Initializing theme provider');
    setMounted(true);
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    console.log('ThemeProvider: Saved theme:', savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
    setTheme(savedTheme);
    console.log('ThemeProvider: Theme provider initialized');
  }, []);

  const handleSetTheme = (newTheme: string) => {
    console.log('ThemeProvider: Setting theme to:', newTheme);
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    console.log('ThemeProvider: Theme set successfully');
  };

  const value = {
    theme,
    setTheme: handleSetTheme,
    resolvedTheme: theme,
  };

  if (!mounted) {
    console.log('ThemeProvider: Not mounted yet');
    return <>{children}</>;
  }

  console.log('ThemeProvider: Rendering with theme:', theme);
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
