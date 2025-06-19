
import React from "react"

type Theme = "dark" | "light" | "system"

interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "dark" | "light"
}

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(
  undefined
)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}) {
  // Initialize theme from localStorage with fallback
  const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') return defaultTheme;
    try {
      const stored = localStorage.getItem(storageKey) as Theme | null
      return stored || defaultTheme
    } catch {
      return defaultTheme
    }
  };

  // Initialize resolved theme
  const getInitialResolvedTheme = (): "dark" | "light" => {
    if (typeof window === 'undefined') return "light";
    try {
      const stored = localStorage.getItem(storageKey) as Theme | null
      if (stored && stored !== "system") {
        return stored
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    } catch {
      return "light"
    }
  };

  const [theme, setThemeState] = React.useState<Theme>(getInitialTheme)
  const [resolvedTheme, setResolvedTheme] = React.useState<"dark" | "light">(getInitialResolvedTheme)

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    let effectiveTheme: "dark" | "light" = theme === "system" 
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : theme

    setResolvedTheme(effectiveTheme)
    root.classList.add(effectiveTheme)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(storageKey, newTheme)
    } catch {
      // Ignore localStorage errors
    }
    setThemeState(newTheme)
  }

  const value = React.useMemo(() => ({
    theme,
    setTheme,
    resolvedTheme,
  }), [theme, resolvedTheme])

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
