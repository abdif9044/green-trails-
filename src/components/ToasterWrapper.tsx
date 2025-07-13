
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useTheme } from "@/providers/theme-provider";

export const ToasterWrapper: React.FC = () => {
  const { resolvedTheme } = useTheme();

  return (
    <>
      <Toaster />
      <Sonner theme={resolvedTheme as "light" | "dark"} />
    </>
  );
};
