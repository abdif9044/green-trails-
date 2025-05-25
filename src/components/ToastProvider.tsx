
import React from 'react';
import { Toaster } from "@/components/ui/toaster";

interface ToastProviderProps {
  children?: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};

export default ToastProvider;
