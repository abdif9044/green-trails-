
import { useState, useEffect } from "react"

export function useThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    setMounted(true)
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      applyTheme(savedTheme)
    } else {
      // Default to system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      applyTheme(systemTheme)
    }
  }, [])

  const applyTheme = (newTheme: string) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    // Apply the actual theme to the document
    let effectiveTheme = newTheme
    if (newTheme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    
    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleSetTheme = (newTheme: string) => {
    applyTheme(newTheme)
  }

  if (!mounted) {
    return {
      theme: 'light',
      setTheme: () => {},
      resolvedTheme: 'light',
    }
  }

  // Calculate resolved theme for display purposes
  let resolvedTheme = theme
  if (theme === 'system') {
    resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  return {
    theme,
    setTheme: handleSetTheme,
    resolvedTheme,
  }
}
