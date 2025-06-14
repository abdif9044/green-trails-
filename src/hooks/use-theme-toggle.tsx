
import { useTheme as useNextTheme } from "next-themes"
import { useEffect, useState } from "react"

export function useThemeToggle() {
  const [mounted, setMounted] = useState(false)
  
  // Only access useTheme after component is mounted to avoid SSR issues
  const themeContext = mounted ? useNextTheme() : { theme: 'light', setTheme: () => {}, resolvedTheme: 'light' }
  
  const { theme, setTheme, resolvedTheme } = themeContext

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render theme-dependent content until mounted
  if (!mounted) {
    return {
      theme: 'light',
      setTheme: () => {},
      resolvedTheme: 'light',
    }
  }

  return {
    theme,
    setTheme,
    resolvedTheme: resolvedTheme ?? theme,
  }
}
