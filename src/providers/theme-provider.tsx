
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
  // Use a more defensive initialization approach
  const [isInitialized, setIsInitialized] = React.useState(false)
  const [theme, setTheme] = React.useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = React.useState<"dark" | "light">("light")

  // Initialize theme from localStorage after component mounts
  React.useEffect(() => {
    if (isInitialized) return
    
    try {
      const storedTheme = localStorage.getItem(storageKey) as Theme | null
      if (storedTheme && (storedTheme === "dark" || storedTheme === "light" || storedTheme === "system")) {
        setTheme(storedTheme)
      }
      
      const getSystemTheme = () => {
        try {
          return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        } catch {
          return "light"
        }
      }
      
      if (storedTheme && storedTheme !== "system") {
        setResolvedTheme(storedTheme as "dark" | "light")
      } else {
        setResolvedTheme(getSystemTheme())
      }
      
      setIsInitialized(true)
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error)
      setResolvedTheme("light")
      setIsInitialized(true)
    }
  }, [storageKey, isInitialized])

  React.useEffect(() => {
    if (!isInitialized) return
    
    try {
      const root = window.document.documentElement
      root.classList.remove("light", "dark")

      let effectiveTheme: "dark" | "light" = theme === "system" 
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : theme

      setResolvedTheme(effectiveTheme)
      root.classList.add(effectiveTheme)
    } catch (error) {
      console.warn('Failed to apply theme:', error)
    }
  }, [theme, isInitialized])

  const handleSetTheme = React.useCallback((newTheme: Theme) => {
    try {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error)
      setTheme(newTheme)
    }
  }, [storageKey])

  const value = React.useMemo(() => ({
    theme,
    setTheme: handleSetTheme,
    resolvedTheme,
  }), [theme, handleSetTheme, resolvedTheme])

  // Don't render children until initialized to prevent hydration issues
  if (!isInitialized) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
