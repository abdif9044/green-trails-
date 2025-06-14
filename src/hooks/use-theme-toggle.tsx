
import { useState, useEffect } from "react"

export function useThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    console.log('useThemeToggle: Initializing theme hook');
    setMounted(true)
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme')
    console.log('useThemeToggle: Saved theme from localStorage:', savedTheme);
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      applyTheme(savedTheme)
    } else {
      // Default to system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      console.log('useThemeToggle: Using system theme:', systemTheme);
      applyTheme(systemTheme)
    }
  }, [])

  const applyTheme = (newTheme: string) => {
    console.log('useThemeToggle: Applying theme:', newTheme);
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    // Apply the actual theme to the document
    let effectiveTheme = newTheme
    if (newTheme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      console.log('useThemeToggle: System theme resolved to:', effectiveTheme);
    }
    
    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    console.log('useThemeToggle: Theme applied successfully');
  }

  const handleSetTheme = (newTheme: string) => {
    console.log('useThemeToggle: Setting new theme:', newTheme);
    applyTheme(newTheme)
  }

  if (!mounted) {
    console.log('useThemeToggle: Not mounted yet, returning defaults');
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

  console.log('useThemeToggle: Returning theme state:', { theme, resolvedTheme });

  return {
    theme,
    setTheme: handleSetTheme,
    resolvedTheme,
  }
}
