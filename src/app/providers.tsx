"use client";

import { AuthProvider } from "@/lib/auth-context";
import { ExtractedDataProvider } from "@/hooks/useExtractedData";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ExtractedDataProvider>
        {children}
      </ExtractedDataProvider>
    </AuthProvider>
  );
}
