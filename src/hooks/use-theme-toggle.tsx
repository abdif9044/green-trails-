
import { useState, useEffect } from "react"

export function useThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Temporary fallback implementation without next-themes
  const handleSetTheme = (newTheme: string) => {
    setTheme(newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  if (!mounted) {
    return {
      theme: 'light',
      setTheme: () => {},
      resolvedTheme: 'light',
    }
  }

  return {
    theme,
    setTheme: handleSetTheme,
    resolvedTheme: theme,
  }
}
