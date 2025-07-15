
import React, { createContext, useState, useEffect, ReactNode } from 'react'

type Theme = "dark" | "light" | "system"

interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "dark" | "light"
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("light")
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Load theme from localStorage and apply it
    try {
      const storedTheme = localStorage.getItem(storageKey) as Theme | null
      if (storedTheme && (storedTheme === "dark" || storedTheme === "light" || storedTheme === "system")) {
        setTheme(storedTheme)
      }

      const getSystemTheme = (): "dark" | "light" => {
        try {
          return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        } catch {
          return "light"
        }
      }

      // Determine resolved theme
      const currentTheme = storedTheme || defaultTheme
      const resolved = currentTheme === "system" ? getSystemTheme() : (currentTheme as "dark" | "light")
      setResolvedTheme(resolved)

      // Apply theme to DOM
      const root = window.document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(resolved)

      setIsInitialized(true)
    } catch (error) {
      console.warn('Failed to initialize theme:', error)
      setResolvedTheme("light")
      setIsInitialized(true)
    }
  }, []) // Empty dependency array - runs once on mount

  // Update DOM when theme changes
  useEffect(() => {
    if (!isInitialized) return

    try {
      const getSystemTheme = (): "dark" | "light" => {
        try {
          return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        } catch {
          return "light"
        }
      }

      const resolved = theme === "system" ? getSystemTheme() : (theme as "dark" | "light")
      setResolvedTheme(resolved)

      const root = window.document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(resolved)

      // Save to localStorage
      localStorage.setItem(storageKey, theme)
    } catch (error) {
      console.warn('Failed to apply theme:', error)
    }
  }, [theme, isInitialized, storageKey])

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
  }

  // Don't render children until initialized
  if (!isInitialized) {
    return null
  }

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme: handleSetTheme, resolvedTheme }}>
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
