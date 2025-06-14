
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps as NextThemeProviderProps } from "next-themes/dist/types"

if (typeof window !== "undefined") {
  // Print the React version at build/runtime
  console.log("[DEBUG] React version for theme-provider:", React.version);
  // Put a global on window to warn if there are multiple Reacts loaded
  if ((window as any).__REACT_SEEN__) {
    throw new Error("Multiple instances of React detected. This can break context and hooks!");
  }
  (window as any).__REACT_SEEN__ = true;
}

// Define our own ThemeProviderProps type
export type ThemeProviderProps = React.PropsWithChildren<Omit<NextThemeProviderProps, "children">>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Add a runtime check/log inside ThemeProvider for debugging
  React.useEffect(() => {
    console.log("[DEBUG] ThemeProvider rendered, React version:", React.version);
  }, []);
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
