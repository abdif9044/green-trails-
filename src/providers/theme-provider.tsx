
import * as React from "react"

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
  const [theme, setTheme] = React.useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  const [resolvedTheme, setResolvedTheme] = React.useState<"dark" | "light">(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme | null
    if (storedTheme && storedTheme !== "system") {
      return storedTheme
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  })

  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    let effectiveTheme: Theme | "dark" | "light" = theme
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
      effectiveTheme = systemTheme
    }

    setResolvedTheme(effectiveTheme as "dark" | "light")
    root.classList.add(effectiveTheme)
  }, [theme])

  const handleSetTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme)
    setTheme(newTheme)
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
