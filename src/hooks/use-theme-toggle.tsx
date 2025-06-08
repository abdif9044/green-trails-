
import { useTheme as useNextTheme } from "next-themes"

export function useThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useNextTheme()

  return {
    theme,
    setTheme,
    resolvedTheme: resolvedTheme ?? theme,
  }
}
