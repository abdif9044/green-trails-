
import * as React from "react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Temporary simple implementation without next-themes
  React.useEffect(() => {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light'
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }, [])

  return <>{children}</>
}
