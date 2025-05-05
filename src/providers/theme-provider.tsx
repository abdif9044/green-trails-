
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps as NextThemeProviderProps } from "next-themes"

// Define the ThemeProviderProps type to match what next-themes expects
type ThemeProviderProps = React.PropsWithChildren<NextThemeProviderProps>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
