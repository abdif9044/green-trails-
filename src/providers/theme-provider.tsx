
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
  // Initialize with default theme to prevent null states
  const [theme, setTheme] = React.useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = React.useState<"dark" | "light">("light")

  // Initialize theme from localStorage after component mounts
  React.useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(storageKey) as Theme | null
      if (storedTheme && (storedTheme === "dark" || storedTheme === "light" || storedTheme === "system")) {
        setTheme(storedTheme)
      }
      
      if (storedTheme && storedTheme !== "system") {
        setResolvedTheme(storedTheme as "dark" | "light")
      } else {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        setResolvedTheme(systemTheme)
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error)
      // Fallback to system theme
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      setResolvedTheme(systemTheme)
    }
  }, [storageKey])

  React.useEffect(() => {
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
  }, [theme])

  const handleSetTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error)
      setTheme(newTheme)
    }
  }

  const value = {
    theme,
    setTheme: handleSetTheme,
    resolvedTheme,
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
