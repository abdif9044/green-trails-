
import { useEffect } from 'react';
import { useTheme } from 'next-themes';

interface UseThemeToggleOptions {
  enabledSystemPreference?: boolean;
  onThemeChange?: (theme: string) => void;
}

/**
 * Hook for easy theme toggling with persistence
 */
export function useThemeToggle(options: UseThemeToggleOptions = {}) {
  const { enabledSystemPreference = true, onThemeChange } = options;
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };
  
  // Set theme to system preference
  const useSystemTheme = () => {
    setTheme('system');
    if (onThemeChange && systemTheme) {
      onThemeChange(systemTheme);
    }
  };
  
  // Use system theme if enabled and no theme is explicitly set
  useEffect(() => {
    if (enabledSystemPreference && !theme) {
      setTheme('system');
    }
  }, [enabledSystemPreference, theme, setTheme]);
  
  return {
    theme,
    resolvedTheme,
    systemTheme,
    toggleTheme,
    useSystemTheme,
    setTheme
  };
}
