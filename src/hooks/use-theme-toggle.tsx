
import { useTheme as useNextTheme } from "next-themes"
import { useEffect, useState } from "react"

export function useThemeToggle() {
  const [mounted, setMounted] = useState(false)
  
  // Always call the hook to follow Rules of Hooks
  const { theme, setTheme, resolvedTheme } = useNextTheme()

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
